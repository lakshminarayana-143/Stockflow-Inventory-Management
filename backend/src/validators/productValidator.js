export const validateCreateProduct = (req, res, next) => {
  const { name, sku, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!sku || typeof sku !== 'string' || sku.trim().length === 0) {
    errors.push('SKU is required');
  }

  if (quantityOnHand !== undefined) {
    const qty = Number(quantityOnHand);
    if (!Number.isInteger(qty) || qty < 0) {
      errors.push('Quantity on hand must be a non-negative integer');
    }
  }

  if (costPrice !== undefined && costPrice !== null && costPrice !== '') {
    const cp = Number(costPrice);
    if (isNaN(cp) || cp < 0) {
      errors.push('Cost price must be a non-negative number');
    }
  }

  if (sellingPrice !== undefined && sellingPrice !== null && sellingPrice !== '') {
    const sp = Number(sellingPrice);
    if (isNaN(sp) || sp < 0) {
      errors.push('Selling price must be a non-negative number');
    }
  }

  if (lowStockThreshold !== undefined && lowStockThreshold !== null && lowStockThreshold !== '') {
    const lst = Number(lowStockThreshold);
    if (!Number.isInteger(lst) || lst < 0) {
      errors.push('Low stock threshold must be a non-negative integer');
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

export const validateUpdateProduct = (req, res, next) => {
  const { name, sku, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push('Product name cannot be empty');
  }

  if (sku !== undefined && (typeof sku !== 'string' || sku.trim().length === 0)) {
    errors.push('SKU cannot be empty');
  }

  if (quantityOnHand !== undefined) {
    const qty = Number(quantityOnHand);
    if (!Number.isInteger(qty) || qty < 0) {
      errors.push('Quantity on hand must be a non-negative integer');
    }
  }

  if (costPrice !== undefined && costPrice !== null && costPrice !== '') {
    const cp = Number(costPrice);
    if (isNaN(cp) || cp < 0) {
      errors.push('Cost price must be a non-negative number');
    }
  }

  if (sellingPrice !== undefined && sellingPrice !== null && sellingPrice !== '') {
    const sp = Number(sellingPrice);
    if (isNaN(sp) || sp < 0) {
      errors.push('Selling price must be a non-negative number');
    }
  }

  if (lowStockThreshold !== undefined && lowStockThreshold !== null && lowStockThreshold !== '') {
    const lst = Number(lowStockThreshold);
    if (!Number.isInteger(lst) || lst < 0) {
      errors.push('Low stock threshold must be a non-negative integer');
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

export const validateStockAdjustment = (req, res, next) => {
  const { deltaUnits, note } = req.body;
  const errors = [];

  if (deltaUnits === undefined || deltaUnits === null) {
    errors.push('Adjustment amount (deltaUnits) is required');
  } else {
    const delta = Number(deltaUnits);
    if (!Number.isInteger(delta)) {
      errors.push('deltaUnits must be a valid integer (+/-)');
    } else if (delta === 0) {
      errors.push('deltaUnits cannot be 0');
    }
  }

  if (note !== undefined && typeof note !== 'string') {
    errors.push('Note must be text if provided');
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

