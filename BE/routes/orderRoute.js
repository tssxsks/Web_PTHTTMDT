import express from 'express';
import { 
  placeOrder, 
  placeOrderStripe,
  verifyStripePayment,
  placeOrderRazorpay,
  verifyRazorpayPayment,
  placeOrderVnpay,
  vnpayReturn,
  placeOrderMomo,
  momoIPN,
  momoReturn,
  placeOrderSolana,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  deleteAllOrdersHandler,
  requestReturnOrder,
  processReturnOrder,
  getReturnOrders,
  getRevenueByDay,
  getRevenueByMonth,
  getRevenueByProduct
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import { paymentRateLimiter } from '../middleware/rateLimit.js';
const router = express.Router();

// Order placement routes
router.post('/cod', protect, placeOrder);

// Stripe routes
router.post('/stripe', protect, paymentRateLimiter, placeOrderStripe);
router.post('/stripe/verify', protect, verifyStripePayment);

// Razorpay routes
router.post('/razorpay', protect, paymentRateLimiter, placeOrderRazorpay);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// VNPay routes
router.post('/vnpay', protect, paymentRateLimiter, placeOrderVnpay);
router.get('/vnpay/return', vnpayReturn); // Public for VNPay callback

// Momo routes
router.post('/momo', protect, paymentRateLimiter, placeOrderMomo);
router.post('/momo/ipn', momoIPN); // Public for Momo IPN
router.get('/momo/return', momoReturn); // Public for Momo callback

// Solana routes
router.post('/solana', protect, paymentRateLimiter, placeOrderSolana);

// User order routes
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderDetails);

// Return/refund routes
router.post('/return', protect, requestReturnOrder);
router.get('/return', adminAuth, getReturnOrders);
router.put('/return/:id', adminAuth, processReturnOrder);

// Admin routes
router.get('/admin/all', adminAuth, getAllOrders);
router.put('/admin/status/:id', adminAuth, updateOrderStatus);
router.delete('/admin/all', adminAuth, deleteAllOrdersHandler);

// Revenue routes
router.get('/revenue-by-day', adminAuth, getRevenueByDay);
router.get('/revenue-by-month', adminAuth, getRevenueByMonth);
router.get('/revenue-by-product', adminAuth, getRevenueByProduct);

export default router;
