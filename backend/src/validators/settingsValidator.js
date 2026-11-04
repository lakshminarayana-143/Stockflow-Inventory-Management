export const validateUpdateSettings = (req, res, next) => {
  const { defaultLowStockThreshold } = req.body;
  const errors = [];

  if (defaultLowStockThreshold === undefined || defaultLowStockThreshold === null) {
    errors.push('defaultLowStockThreshold is required');
  } else {
    const val = Number(defaultLowStockThreshold);
    if (!Number.isInteger(val) || val < 0) {
      errors.push('defaultLowStockThreshold must be a non-negative integer');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: errors[0],
      errors,
    });
  }

  next();
};

