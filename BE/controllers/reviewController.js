import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate({
        path: 'userId',
        select: 'name avatar', // Lấy tên và avatar người dùng
      })
      .sort({ createdAt: -1 }); // Mới nhất lên đầu

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add or Update Review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // req.user lấy từ middleware protect trong auth.js
    const userId = req.user._id; 

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Kiểm tra xem user đã review chưa
    const alreadyReviewed = await Review.findOne({ productId, userId });

    if (alreadyReviewed) {
      // Nếu có rồi thì cập nhật (Update)
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
      
      res.status(200).json({ success: true, message: 'Review updated successfully' });
    } else {
      // Nếu chưa thì tạo mới (Create)
      await Review.create({
        productId,
        userId,
        rating: Number(rating),
        comment,
      });

      res.status(201).json({ success: true, message: 'Review added successfully' });
    }
    
    // Lưu ý: Hàm calcAverageRatings trong Model sẽ tự chạy sau khi save
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (User/Admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Kiểm tra quyền: Chỉ chủ review hoặc Admin mới được xóa
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};