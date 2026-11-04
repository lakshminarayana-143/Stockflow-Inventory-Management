import { Organization } from '../models/Organization.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export const getSettings = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.organizationId);

    if (!organization) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Organization not found.'));
    }

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      {
        id: organization._id,
        name: organization.name,
        defaultLowStockThreshold: organization.defaultLowStockThreshold,
      },
      'Organization settings retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { defaultLowStockThreshold, name } = req.body;

    const organization = await Organization.findById(req.organizationId);

    if (!organization) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Organization not found.'));
    }

    if (defaultLowStockThreshold !== undefined) {
      organization.defaultLowStockThreshold = Number(defaultLowStockThreshold);
    }

    if (name && typeof name === 'string' && name.trim()) {
      organization.name = name.trim();
    }

    await organization.save();

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      {
        id: organization._id,
        name: organization.name,
        defaultLowStockThreshold: organization.defaultLowStockThreshold,
      },
      'Settings updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

