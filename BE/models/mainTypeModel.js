import mongoose from 'mongoose';

const mainTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter main type name'],
      unique: true,
      trim: true,
    },

    displayName: {
      type: String,
      required: [true, 'Please enter display name'],
      // VD: 'Giày', 'Dép', 'Bốt', 'Lười', 'Dép quai'
    },

    description: {
      type: String,
      default: '',
    },

    // Ảnh đại diện cho main type
    imageUrl: {
      type: String,
      required: [true, 'Please upload main type image'],
    },
    imagePublicId: {
      type: String,
      required: true,
    },

    // control hiển thị
    isActive: {
      type: Boolean,
      default: true,
    },

    // sắp xếp thứ tự ngoài Home
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('MainType', mainTypeSchema);
