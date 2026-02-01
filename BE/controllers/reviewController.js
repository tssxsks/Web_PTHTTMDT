import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';

// @desc    Lấy danh sách review
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate({
        path: 'userId',
        select: 'name avatar', // Lấy tên và avatar để hiển thị
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Thêm hoặc Sửa review (Upsert logic)
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id; // Lấy từ token

    // 1. Kiểm tra sản phẩm
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    // 2. Kiểm tra xem user đã review sản phẩm này chưa
    const existingReview = await Review.findOne({ productId, userId });

    if (existingReview) {
      // --- TRƯỜNG HỢP 1: ĐÃ CÓ -> CẬP NHẬT (EDIT) ---
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      // Cập nhật lại thời gian (nếu muốn review nổi lên đầu thì dùng Date.now())
      // existingReview.createdAt = Date.now(); 
      
      await existingReview.save(); 
      // Lưu ý: Middleware .post('save') trong Model sẽ tự động tính lại sao trung bình cho Product

      return res.status(200).json({ success: true, message: 'Đã cập nhật đánh giá của bạn' });

    } else {
      // --- TRƯỜNG HỢP 2: CHƯA CÓ -> TẠO MỚI (ADD) ---
      await Review.create({
        productId,
        userId,
        rating: Number(rating),
        comment,
      });

      return res.status(201).json({ success: true, message: 'Đã gửi đánh giá thành công' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server khi đánh giá' });
  }
};

// ... (Hàm deleteReview giữ nguyên)
export const deleteReview = async (req, res) => {
    // Code xóa giữ nguyên như cũ
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ success: false, message: "Not found" });
        
        if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }
        await Review.findByIdAndDelete(req.params.reviewId);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body; // Nội dung trả lời của admin

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung trả lời' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }

    // Cập nhật trường adminReply
    review.adminReply = {
      comment: comment,
      date: new Date()
    };

    await review.save();

    res.status(200).json({ success: true, message: 'Đã trả lời đánh giá', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};