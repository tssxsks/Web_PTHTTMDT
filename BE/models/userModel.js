import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password should be at least 6 characters long'],
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      ward: String,
      district: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    cart: {
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
          },
          size: {
            type: Number,
            required: true
          },
          price: {
            type: Number,
            required: true
          }
        }
      ],
      totalAmount: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);