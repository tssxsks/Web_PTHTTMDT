import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter brand name'],
      unique: true,
      trim: true,
      // VD: 'Nike', 'Adidas', 'Puma', 'New Balance'
    },
    logo: {
      public_id: String,
      url: String,
    },
    mainTypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainType',
      },
    ],
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Brand', brandSchema);
