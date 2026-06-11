import { Router } from 'express';
import { createBug, getAllBugs, updateBug, deleteBug } from '../controllers/bugController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Publicly readable or login-protected list of bugs
router.get('/', authMiddleware, getAllBugs);

// Mutating endpoints are strictly protected by auth token
router.post('/', authMiddleware, createBug);
router.put('/:id', authMiddleware, updateBug);
router.delete('/:id', authMiddleware, deleteBug);

export default router;
