import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Create HMAC hash for payment verification (VNPay)
const createVnpayHmac = (data, secretKey) => {
  return crypto
    .createHmac('sha512', secretKey)
    .update(data)
    .digest('hex');
};

// Create hash for Momo payment verification
const createMomoHash = (data, secretKey) => {
  return crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex');
};

// Verify signature for Razorpay
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest('hex');
    
  return generated_signature === signature;
};

export {
  createVnpayHmac,
  createMomoHash,
  verifyRazorpaySignature
};