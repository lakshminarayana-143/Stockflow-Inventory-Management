import { Product } from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { DEFAULT_LOW_STOCK_THRESHOLD } from '../constants/defaultSettings.js';

// Helper to calculate isLowStock and effectiveThreshold
const formatProductResponse = (product, defaultThreshold = DEFAULT_LOW_STOCK_THRESHOLD) => {
  const prodObj = product.toObject ? product.toObject() : product;
  const effectiveThreshold =
    prodObj.lowStockThreshold !== null && prodObj.lowStockThreshold !== undefined
      ? prodObj.lowStockThreshold
      : defaultThreshold;

  return {
    ...prodObj,
    effectiveThreshold,
    isLowStock: prodObj.quantityOnHand <= effectiveThreshold,
  };
};

export const getProducts = async (req, res, next) => {
  try {
    const { q, sort = 'createdAt', order = 'desc' } = req.query;
    const organizationId = req.organizationId;
    const defaultThreshold =
      req.user.organization?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

    const filter = { organization: organizationId };

    if (q && q.trim()) {
      const searchTerm = q.trim();
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { sku: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const sortOption = {};
    sortOption[sort] = order === 'asc' ? 1 : -1;

    const products = await Product.find(filter)
      .sort(sortOption)
      .populate('lastUpdatedBy', 'email');

    const formattedProducts = products.map((prod) =>
      formatProductResponse(prod, defaultThreshold)
    );

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      {
        total: formattedProducts.length,
        products: formattedProducts,
      },
      'Products retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.organizationId;
    const defaultThreshold =
      req.user.organization?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

    const product = await Product.findOne({
      _id: id,
      organization: organizationId,
    }).populate('lastUpdatedBy', 'email');

    if (!product) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found.'));
    }

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      formatProductResponse(product, defaultThreshold),
      'Product retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const organizationId = req.organizationId;
    const defaultThreshold =
      req.user.organization?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

    const {
      name,
      sku,
      description,
      quantityOnHand = 0,
      costPrice = 0,
      sellingPrice = 0,
      lowStockThreshold = null,
    } = req.body;

    const normalizedSku = sku.trim().toUpperCase();

    // Check for duplicate SKU within organization
    const existingSku = await Product.findOne({
      organization: organizationId,
      sku: normalizedSku,
    });

    if (existingSku) {
      return next(
        new ApiError(
          HTTP_STATUS.CONFLICT,
          `A product with SKU "${normalizedSku}" already exists in your organization.`
        )
      );
    }

    const product = await Product.create({
      organization: organizationId,
      name: name.trim(),
      sku: normalizedSku,
      description: description ? description.trim() : '',
      quantityOnHand: Number(quantityOnHand) || 0,
      costPrice: costPrice !== undefined && costPrice !== '' ? Number(costPrice) : 0,
      sellingPrice: sellingPrice !== undefined && sellingPrice !== '' ? Number(sellingPrice) : 0,
      lowStockThreshold:
        lowStockThreshold !== undefined && lowStockThreshold !== null && lowStockThreshold !== ''
          ? Number(lowStockThreshold)
          : null,
      lastUpdatedBy: req.user._id,
    });

    return ApiResponse.success(
      res,
      HTTP_STATUS.CREATED,
      formatProductResponse(product, defaultThreshold),
      'Product created successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.organizationId;
    const defaultThreshold =
      req.user.organization?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

    const product = await Product.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!product) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found.'));
    }

    const {
      name,
      sku,
      description,
      quantityOnHand,
      costPrice,
      sellingPrice,
      lowStockThreshold,
    } = req.body;

    // Check SKU conflict if SKU is being changed
    if (sku) {
      const normalizedSku = sku.trim().toUpperCase();
      if (normalizedSku !== product.sku) {
        const existingSku = await Product.findOne({
          organization: organizationId,
          sku: normalizedSku,
          _id: { $ne: product._id },
        });

        if (existingSku) {
          return next(
            new ApiError(
              HTTP_STATUS.CONFLICT,
              `A product with SKU "${normalizedSku}" already exists in your organization.`
            )
          );
        }
        product.sku = normalizedSku;
      }
    }

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (quantityOnHand !== undefined) product.quantityOnHand = Number(quantityOnHand);
    if (costPrice !== undefined) product.costPrice = costPrice !== '' ? Number(costPrice) : 0;
    if (sellingPrice !== undefined)
      product.sellingPrice = sellingPrice !== '' ? Number(sellingPrice) : 0;
    if (lowStockThreshold !== undefined) {
      product.lowStockThreshold =
        lowStockThreshold !== null && lowStockThreshold !== ''
          ? Number(lowStockThreshold)
          : null;
    }

    product.lastUpdatedBy = req.user._id;
    await product.save();

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      formatProductResponse(product, defaultThreshold),
      'Product updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deltaUnits } = req.body;
    const organizationId = req.organizationId;
    const defaultThreshold =
      req.user.organization?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

    const product = await Product.findOne({
      _id: id,
      organization: organizationId,
    });

    if (!product) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found.'));
    }

    const delta = Number(deltaUnits);
    const newQty = product.quantityOnHand + delta;

    if (newQty < 0) {
      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Cannot reduce stock by ${Math.abs(delta)}. Current quantity on hand is ${product.quantityOnHand}.`
        )
      );
    }

    product.quantityOnHand = newQty;
    product.lastUpdatedBy = req.user._id;
    await product.save();

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      formatProductResponse(product, defaultThreshold),
      `Stock adjusted by ${delta > 0 ? `+${delta}` : delta} units successfully`
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.organizationId;

    const product = await Product.findOneAndDelete({
      _id: id,
      organization: organizationId,
    });

    if (!product) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found.'));
    }

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      { id: product._id },
      'Product deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};

