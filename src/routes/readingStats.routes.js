import express from 'express';
import { getReadingStats, updateReadingGoal } from '../controllers/readingStats.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getRadingStats);
router.put('/goal', protect, updateReadingGoal);

export default router;
