import express from 'express';
import {
  createTutorial,
  updateTutorial,
  deleteTutorial,
  getAllTutorials,
} from '../controllers/tutorial.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User & Admin
router.get('/', protect, getAllTutorials);

// Admin only
router.post('/', protect, adminOnly, createTutorial);
router.put('/:id', protect, adminOnly, updateTutorial);
router.delete('/:id', protect, adminOnly, deleteTutorial);

export default router;
