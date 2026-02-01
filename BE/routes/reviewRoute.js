import express from 'express';
import { getReviews, addReview, deleteReview, replyToReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public: Lấy danh sách review theo productId
router.get('/:productId', getReviews);

// Private: Phải đăng nhập mới được review hoặc xóa
router.post('/', protect, addReview);
router.delete('/:reviewId', protect, deleteReview);

// Admin trả lời review
router.put('/:reviewId/reply', protect, admin, replyToReview);

export default router;