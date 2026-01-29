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
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('MainType', mainTypeSchema);
