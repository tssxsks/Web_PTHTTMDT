import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Sign a new JWT token
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Verify a JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Create token and send cookie response
const createSendToken = (user, statusCode, res) => {
  // Generate token
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

export {
  signToken,
  verifyToken,
  createSendToken
};