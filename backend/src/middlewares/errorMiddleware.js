import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    if (field === 'sku' || (err.keyPattern && err.keyPattern.sku)) {
      message = 'A product with this SKU already exists in your organization.';
    } else if (field === 'email') {
      message = 'An account with this email address already exists.';
    } else {
      message = `Duplicate value entered for ${field}.`;
    }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errors = Object.values(err.errors).map((val) => val.message);
    message = errors[0] || 'Validation error';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Resource not found with id: ${err.value}`;
  }

  const response = {
    success: false,
    statusCode,
    message,
    errors: errors.length > 0 ? errors : undefined,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

