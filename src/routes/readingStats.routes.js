import express from 'express';
import { getReadingStats } from '../controllers/readingStats.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getReadingStats);

export default router;
