import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken } from '../utils/jwt.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, organizationName } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(new ApiError(HTTP_STATUS.CONFLICT, 'An account with this email address already exists.'));
    }

    // 1. Create Organization
    const organization = await Organization.create({
      name: organizationName.trim(),
    });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create User linked to Organization
    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      organization: organization._id,
      role: 'owner',
    });

    const token = generateToken({
      userId: user._id,
      organizationId: organization._id,
    });

    setAuthCookie(res, token);

    return ApiResponse.success(
      res,
      HTTP_STATUS.CREATED,
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        organization: {
          id: organization._id,
          name: organization.name,
          defaultLowStockThreshold: organization.defaultLowStockThreshold,
        },
      },
      'Organization and account registered successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail })
      .select('+passwordHash')
      .populate('organization');

    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.'));
    }

    const token = generateToken({
      userId: user._id,
      organizationId: user.organization._id,
    });

    setAuthCookie(res, token);

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        organization: {
          id: user.organization._id,
          name: user.organization.name,
          defaultLowStockThreshold: user.organization.defaultLowStockThreshold,
        },
      },
      'Logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      {
        user: {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
        },
        organization: {
          id: req.user.organization._id,
          name: req.user.organization.name,
          defaultLowStockThreshold: req.user.organization.defaultLowStockThreshold,
        },
      },
      'User profile fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    return ApiResponse.success(res, HTTP_STATUS.OK, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

