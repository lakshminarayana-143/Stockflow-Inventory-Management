import { Product } from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { DEFAULT_LOW_STOCK_THRESHOLD } from '../constants/defaultSettings.js';

export const getDashboardOverview = async (req, res, next) => {
  try {
    const organizationId = req.organizationId;
    const defaultThreshold =
      req.user.organization?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;

    // Fetch all products for the tenant
    const products = await Product.find({ organization: organizationId }).sort({
      quantityOnHand: 1,
    });

    const totalProducts = products.length;
    let totalStock = 0;
    const lowStockItems = [];

    for (const product of products) {
      totalStock += product.quantityOnHand;

      const effectiveThreshold =
        product.lowStockThreshold !== null && product.lowStockThreshold !== undefined
          ? product.lowStockThreshold
          : defaultThreshold;

      if (product.quantityOnHand <= effectiveThreshold) {
        lowStockItems.push({
          _id: product._id,
          name: product.name,
          sku: product.sku,
          quantityOnHand: product.quantityOnHand,
          lowStockThreshold: product.lowStockThreshold,
          effectiveThreshold,
          sellingPrice: product.sellingPrice,
        });
      }
    }

    return ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      {
        summary: {
          totalProducts,
          totalStock,
          lowStockCount: lowStockItems.length,
          defaultLowStockThreshold: defaultThreshold,
        },
        lowStockProducts: lowStockItems,
      },
      'Dashboard overview retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

