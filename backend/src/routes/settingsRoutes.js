import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { validateUpdateSettings } from '../validators/settingsValidator.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireTenant } from '../middlewares/tenantMiddleware.js';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/', getSettings);
router.put('/', validateUpdateSettings, updateSettings);

export default router;

