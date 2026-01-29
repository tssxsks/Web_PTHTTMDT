import express from 'express';
import { addToCart, updateCart, removeFromCart, getUserCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// All routes are protected
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCart);
router.post('/remove', protect, removeFromCart);
router.get('/', protect, getUserCart);
router.post('/clear', protect, clearCart);

export default router;