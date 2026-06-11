import { Router } from 'express';
import { registerUser, loginUser, getProfile, updateHighScore } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/high-score', authMiddleware, updateHighScore);

export default router;
