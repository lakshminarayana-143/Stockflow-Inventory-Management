import { Router } from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../validators/authValidator.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;

