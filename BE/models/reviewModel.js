import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index để đảm bảo 1 user chỉ review 1 sản phẩm 1 lần (Unique)
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Static method để tính toán điểm trung bình
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { productId: productId },
    },
    {
      $group: {
        _id: '$productId',
        nRating: { $sum: 1 }, // Tổng số đánh giá
        avgRating: { $avg: '$rating' }, // Điểm trung bình
      },
    },
  ]);

  try {
    // Cập nhật lại vào Product Model (lưu ý tên field khớp với productModel.js của bạn)
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratings: stats.length > 0 ? stats[0].avgRating : 0,
      numReviews: stats.length > 0 ? stats[0].nRating : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Gọi tính toán sau khi lưu (Save)
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.productId);
});

// Gọi tính toán sau khi xóa (Delete)
// Lưu ý: dùng findOneAndDelete để kích hoạt middleware này
reviewSchema.post(/^findOneAnd/, function (doc) {
  if (doc) {
    doc.constructor.calcAverageRatings(doc.productId);
  }
});

export default mongoose.model('Review', reviewSchema);