import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication token is missing. Please log in.'));
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired session. Please log in again.'));
    }

    const user = await User.findById(decoded.userId).populate('organization');
    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User associated with token no longer exists.'));
    }

    req.user = user;
    req.organizationId = user.organization._id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Session expired or invalid. Please log in again.'));
    }
    next(error);
  }
};

