import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price'],
      min: [0, 'Price cannot be negative'],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    mainType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MainType',
      required: [true, 'Please select main type'],
    },
    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType',
      required: [true, 'Please select product type'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Please select brand'],
    },
    age: {
      type: String,
      enum: ['adults', 'kids'],
      default: 'adults',
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    subCategory: {
      type: String,
      trim: true,
    },
    sizes: [
      {
        size: {
          type: Number,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: [0, 'Stock cannot be negative'],
        },
      },
    ],
    color: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create index for searching
productSchema.index({ name: 'text', description: 'text', subCategory: 'text', color: 'text', material: 'text' });

export default mongoose.model('Product', productSchema);