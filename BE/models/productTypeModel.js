import mongoose from 'mongoose';

const productTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product type name'],
      trim: true,
      // VD: 'sport', 'lazy', 'casual', 'formal', 'boot', 'heels'
    },
    displayName: {
      type: String,
      required: [true, 'Please enter display name'],
      // VD: 'Thể thao', 'Lười', 'Casual', 'Formal', 'Boot', 'Cao gót'
    },
    mainType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MainType',
      required: [true, 'Please select main type'],
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ProductType', productTypeSchema);
