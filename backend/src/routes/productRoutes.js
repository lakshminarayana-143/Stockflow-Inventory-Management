import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireTenant } from '../middlewares/tenantMiddleware.js';
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateStockAdjustment,
} from '../validators/productValidator.js';

const router = Router();

// Apply auth and tenant guards to all product routes
router.use(authenticate, requireTenant);

router.get('/', getProducts);
router.post('/', validateCreateProduct, createProduct);
router.get('/:id', getProductById);
router.put('/:id', validateUpdateProduct, updateProduct);
router.patch('/:id/adjust', validateStockAdjustment, adjustStock);
router.delete('/:id', deleteProduct);

export default router;

