import express from 'express';
import {
  createReview,
  getPendingReviews,
  approveReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);

router.get('/pending', protect, adminOnly, getPendingReviews);
router.patch('/:id/approve', protect, adminOnly, approveReview);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
