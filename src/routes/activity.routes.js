import express from 'express';
import { getActivityFeed } from '../controllers/activity.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getActivityFeed);

export default router;
