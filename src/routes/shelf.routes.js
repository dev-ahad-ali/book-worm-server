import express from 'express';
import {
  addToShelf,
  getMyLibrary,
  removeFromShelf,
  updateShelf,
} from '../controllers/shelf.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, addToShelf);
router.get('/', protect, getMyLibrary);
router.put('/:bookId', protect, updateShelf);
router.delete('/:bookId', protect, removeFromShelf);

export default router;
