import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { placeOrder as placeOrderService } from '../services/orderService.js';
import { getAllOrders as getAllOrdersService, updateOrderStatus as updateOrderStatusService, deleteAllOrders } from '../services/adminOrderService.js';
import { requestReturnOrder as requestReturnOrderService, processReturnOrder as processReturnOrderService, getReturnOrders as getReturnOrdersService } from '../services/returnOrderService.js';
import RevenueService from '../services/revenueService.js';
import StripeService from '../services/stripeService.js';
import RazorpayService from '../services/razorpayService.js';
import { createVnpayPayment, handleVnpayReturn } from '../services/vnpayService.js';
import { createMomoPayment, handleMomoIPN } from '../services/momoService.js';
import SolanaService from '../services/solanaService.js';
import { getPagination } from '../utils/pagination.js';

// @desc    Place a new order (COD)
// @route   POST /api/order/cod
// @access  Private
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, contactInfo } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address and contact information'
      });
    }

    // Place order using order service
    const result = await placeOrderService(req.user._id, {
      shippingAddress,
      contactInfo,
      paymentMethod: 'COD'
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
};

// @desc    Place order with Stripe
// @route   POST /api/order/stripe
// @access  Private
export const placeOrderStripe = async (req, res) => {
  try {
    const { shippingAddress, contactInfo } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address and contact information'
      });
    }

    // Create Stripe session
    const stripeResult = await StripeService.createStripeCheckout(req.user._id, {
      shippingAddress,
      contactInfo
    });

    res.status(200).json(stripeResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing Stripe payment',
      error: error.message
    });
  }
};

// @desc    Verify Stripe payment
// @route   POST /api/order/stripe/verify
// @access  Private
export const verifyStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Verify payment and update order
    const result = await StripeService.verifyPayment(sessionId, req.user._id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying Stripe payment',
      error: error.message
    });
  }
};

// @desc    Place order with Razorpay
// @route   POST /api/order/razorpay
// @access  Private
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { shippingAddress, contactInfo } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address and contact information'
      });
    }

    // Create Razorpay order
    const razorpayResult = await RazorpayService.createRazorpayOrder(req.user._id, {
      shippingAddress,
      contactInfo
    });

    res.status(200).json(razorpayResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing Razorpay payment',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/order/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'All payment details are required'
      });
    }

    // Verify payment and update order
    const result = await RazorpayService.verifyPayment({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    }, req.user._id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying Razorpay payment',
      error: error.message
    });
  }
};

// @desc    Place order with VNPay
// @route   POST /api/order/vnpay
// @access  Private
export const placeOrderVnpay = async (req, res) => {
  try {
    const { shippingAddress, contactInfo, returnUrl } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !contactInfo || !returnUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address, contact information, and return URL'
      });
    }

    // Create VNPay payment URL
    const vnpayResult = await createVnpayPayment(req.user._id, {
      shippingAddress,
      contactInfo,
      returnUrl,
      ipAddr: req.ip
    });

    res.status(200).json(vnpayResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing VNPay payment',
      error: error.message
    });
  }
};

// @desc    Handle VNPay return
// @route   GET /api/order/vnpay/return
// @access  Public
export const vnpayReturn = async (req, res) => {
  try {
    // Verify VNPay return data
    const result = await handleVnpayReturn(req.query);

    // Redirect to frontend with status
    const redirectUrl = `${process.env.FRONTEND_URL}/verify?status=${result.success ? 'success' : 'failed'}&orderId=${result.orderId || ''}&message=${result.message || ''}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('VNPay return error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/verify?status=failed&message=Payment verification failed`);
  }
};

// @desc    Place order with Momo
// @route   POST /api/order/momo
// @access  Private
export const placeOrderMomo = async (req, res) => {
  try {
    const { shippingAddress, contactInfo, returnUrl, notifyUrl } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !contactInfo || !returnUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address, contact information, and return URL'
      });
    }

    // Create Momo payment URL
    const momoResult = await createMomoPayment(req.user._id, {
      shippingAddress,
      contactInfo,
      returnUrl,
      notifyUrl: notifyUrl || process.env.MOMO_NOTIFY_URL,
      ipAddr: req.ip
    });

    res.status(200).json(momoResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing Momo payment',
      error: error.message
    });
  }
};

// @desc    Handle Momo IPN (Instant Payment Notification)
// @route   POST /api/order/momo/ipn
// @access  Public
export const momoIPN = async (req, res) => {
  try {
    // Handle Momo IPN notification
    const result = await handleMomoIPN(req.body);
    
    // Send response back to Momo
    res.status(200).json(result);
  } catch (error) {
    console.error('Momo IPN error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing Momo IPN',
    });
  }
};

// @desc    Handle Momo return
// @route   GET /api/order/momo/return
// @access  Public
export const momoReturn = async (req, res) => {
  try {
    // Get order details from Momo response
    const { orderId, resultCode } = req.query;
    
    // Redirect to frontend with status
    const redirectUrl = `${process.env.FRONTEND_URL}/verify?status=${resultCode === '0' ? 'success' : 'failed'}&orderId=${orderId || ''}&message=${resultCode === '0' ? 'Payment successful' : 'Payment failed'}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Momo return error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/verify?status=failed&message=Payment verification failed`);
  }
};

// @desc    Place order with Solana
// @route   POST /api/order/solana
// @access  Private
export const placeOrderSolana = async (req, res) => {
  try {
    const { shippingAddress, contactInfo, signature } = req.body;
    
    // Validate required fields
    if (!shippingAddress || !contactInfo || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address, contact information, and transaction signature'
      });
    }

    // Process Solana payment
    const solanaResult = await SolanaService.processSolanaPayment(req.user._id, {
      shippingAddress,
      contactInfo,
      signature
    });

    res.status(200).json(solanaResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing Solana payment',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/order
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Count total user orders
    const totalItems = await Order.countDocuments({ user: req.user._id });

    // Get pagination details
    const pagination = getPagination(page, limit, totalItems);

    // Get user orders
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).json({
      success: true,
      pagination,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get order details
// @route   GET /api/order/:id
// @access  Private
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find order
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user or user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
};

// Admin Controllers
// @desc    Get all orders (admin)
// @route   GET /api/order/admin/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    // Get all orders using admin service
    const result = await getAllOrdersService(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all orders',
      error: error.message
    });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/order/admin/status/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    // Update order status using admin service
    const result = await updateOrderStatusService(id, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Delete all orders (admin)
// @route   DELETE /api/order/admin/all
// @access  Private/Admin
export const deleteAllOrdersHandler = async (req, res) => {
  try {
    const result = await deleteAllOrders();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting all orders',
      error: error.message
    });
  }
};

// Return Order Controllers
// @desc    Request return/refund
// @route   POST /api/order/return
// @access  Private
export const requestReturnOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    
    if (!orderId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order ID and reason'
      });
    }

    // Request return using return order service
    const result = await requestReturnOrderService(orderId, reason, req.user._id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error requesting order return',
      error: error.message
    });
  }
};

// @desc    Process return request (admin)
// @route   PUT /api/order/return/:id
// @access  Private/Admin
export const processReturnOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status (approved/rejected)'
      });
    }

    // Process return request using return order service
    const result = await processReturnOrderService(id, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing return request',
      error: error.message
    });
  }
};

// @desc    Get return requests (admin)
// @route   GET /api/order/return
// @access  Private/Admin
export const getReturnOrders = async (req, res) => {
  try {
    // Get return orders using return order service
    const result = await getReturnOrdersService(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching return requests',
      error: error.message
    });
  }
};

// Revenue Controllers
// @desc    Get revenue by day (admin)
// @route   GET /api/order/revenue-by-day
// @access  Private/Admin
export const getRevenueByDay = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start date and end date'
      });
    }

    const result = await RevenueService.getRevenueByDay(startDate, endDate);
    res.status(200).json({
      success: true,
      revenue: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue by day',
      error: error.message
    });
  }
};

// @desc    Get revenue by month (admin)
// @route   GET /api/order/revenue-by-month
// @access  Private/Admin
export const getRevenueByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    
    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide year'
      });
    }

    const result = await RevenueService.getRevenueByMonth(year);
    res.status(200).json({
      success: true,
      revenue: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue by month',
      error: error.message
    });
  }
};

// @desc    Get revenue by product (admin)
// @route   GET /api/order/revenue-by-product
// @access  Private/Admin
export const getRevenueByProduct = async (req, res) => {
  try {
    const result = await RevenueService.getRevenueByProduct();
    res.status(200).json({
      success: true,
      revenue: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue by product',
      error: error.message
    });
  }
};
