import express from 'express';
import { authMiddleware } from '../middleware/passportMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = express.Router();

router.get('/stats', authMiddleware, getDashboardStats);

export default router;
