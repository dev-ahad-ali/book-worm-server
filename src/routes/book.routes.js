import express from 'express';
import {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookDetails,
} from '../controllers/book.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getAllBooks);
router.get('/:id', protect, getBookDetails);

router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

export default router;
