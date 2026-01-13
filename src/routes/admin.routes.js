import express from 'express';
import { getAdminStats } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getAdminStats);

export default router;
