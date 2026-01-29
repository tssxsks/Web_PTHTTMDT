import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: [true, 'Please enter size value'],
      unique: true,
      trim: true,
      // VD: '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'
    },
    mainType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MainType',
      required: [true, 'Please select main type']
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Size', sizeSchema);
