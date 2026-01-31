import express from 'express';
import { getReviews, addReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js'; // Import middleware protect từ file auth.js của bạn

const router = express.Router();

// Public: Lấy danh sách review theo productId
router.get('/:productId', getReviews);

// Private: Phải đăng nhập mới được review hoặc xóa
router.post('/', protect, addReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;