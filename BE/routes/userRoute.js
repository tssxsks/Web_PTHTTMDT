import express from 'express';
import { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { loginRateLimiter } from '../middleware/rateLimit.js';
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginRateLimiter, loginUser);
router.post('/admin/login', loginRateLimiter, adminLogin);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/change-password', protect, changePassword);

export default router;