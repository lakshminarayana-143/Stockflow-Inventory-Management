import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireTenant } from '../middlewares/tenantMiddleware.js';

const router = Router();

router.use(authenticate, requireTenant);

router.get('/overview', getDashboardOverview);

export default router;

