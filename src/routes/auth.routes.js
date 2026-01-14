import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  refreshAccessToken,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.post('/refresh', refreshAccessToken);

export default router;
