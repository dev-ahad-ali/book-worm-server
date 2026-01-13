import express from 'express';
import {
  createGenre,
  updateGenre,
  getGenres,
  deleteGenre,
} from '../controllers/genre.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getGenres);
router.post('/', protect, adminOnly, createGenre);
router.put('/:id', protect, adminOnly, updateGenre);
router.delete('/:id', protect, adminOnly, deleteGenre);

export default router;
