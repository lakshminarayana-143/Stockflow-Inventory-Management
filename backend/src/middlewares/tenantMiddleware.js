import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export const requireTenant = (req, res, next) => {
  if (!req.organizationId) {
    return next(new ApiError(HTTP_STATUS.FORBIDDEN, 'Tenant context missing. Cannot access resource.'));
  }
  next();
};

