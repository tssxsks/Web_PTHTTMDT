import Order from '../models/orderModel.js';
import { createVnpayHmac } from '../utils/crypto.js';
import { placeOrder } from './orderService.js';
import querystring from 'querystring';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Create VNPay payment URL
 * @param {ObjectId} userId - User ID
 * @param {Object} paymentData - Payment data (shipping, contact, returnUrl)
 * @returns {Object} Payment URL and temporary order ID
 */
export const createVnpayPayment = async (userId, paymentData) => {
  const { shippingAddress, contactInfo, returnUrl, ipAddr } = paymentData;

  // Create temporary order
  const orderResult = await placeOrder(userId, {
    shippingAddress,
    contactInfo,
    paymentMethod: 'VNPay'
  });

  const order = orderResult.order;

  // VNPay parameters
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const vnpUrl = process.env.VNPAY_URL;

  const createDate = new Date().toISOString().split('T')[0].split('-').join('') + 
                    new Date().toTimeString().split(' ')[0].split(':').join('');
  const orderId = order._id.toString();
  const amount = order.totalPrice;
  const bankCode = '';
  const orderInfo = `Thanh toan don hang #${orderId}`;
  const orderType = 'billpayment';
  const locale = 'vn';
  const currCode = 'VND';

  // Build data for VNPay
  const vnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100, // Convert to smallest currency unit
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  // Add bank code if provided
  if (bankCode !== '') {
    vnpParams['vnp_BankCode'] = bankCode;
  }

  // Sort params
  const sortedParams = {};
  const keys = Object.keys(vnpParams).sort();
  keys.forEach((key) => {
    sortedParams[key] = vnpParams[key];
  });

  // Create query string
  const queryParams = querystring.stringify(sortedParams);

  // Create HMAC signature
  const hmac = createVnpayHmac(queryParams, secretKey);

  // Create full payment URL
  const paymentUrl = `${vnpUrl}?${queryParams}&vnp_SecureHash=${hmac}`;

  return {
    success: true,
    paymentUrl,
    orderId
  };
};

/**
 * Handle VNPay return
 * @param {Object} returnData - VNPay return parameters
 * @returns {Object} Verification result
 */
export const handleVnpayReturn = async (returnData) => {
  const vnpParams = { ...returnData };
  const secureHash = vnpParams['vnp_SecureHash'];
  
  // Remove hash from params
  delete vnpParams['vnp_SecureHash'];
  delete vnpParams['vnp_SecureHashType'];
  
  // Sort params
  const sortedParams = {};
  const keys = Object.keys(vnpParams).sort();
  keys.forEach((key) => {
    sortedParams[key] = vnpParams[key];
  });
  
  // Create query string
  const queryParams = querystring.stringify(sortedParams);
  
  // Create HMAC signature
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const hmac = createVnpayHmac(queryParams, secretKey);
  
  // Verify signature
  if (secureHash !== hmac) {
    return {
      success: false,
      message: 'Invalid signature',
      orderId: vnpParams['vnp_TxnRef']
    };
  }
  
  // Check payment status
  const orderId = vnpParams['vnp_TxnRef'];
  const responseCode = vnpParams['vnp_ResponseCode'];
  
  // Find order
  const order = await Order.findById(orderId);
  
  if (!order) {
    return {
      success: false,
      message: 'Order not found',
      orderId
    };
  }
  
  // Check if payment is successful
  if (responseCode === '00') {
    // Update order if not already paid
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: vnpParams['vnp_TransactionNo'],
        status: 'Completed',
        update_time: new Date().toISOString(),
        transaction_id: vnpParams['vnp_TransactionNo'],
        payment_provider: 'VNPay'
      };
      
      await order.save();
    }
    
    return {
      success: true,
      message: 'Payment successful',
      orderId
    };
  } else {
    return {
      success: false,
      message: `Payment failed with code: ${responseCode}`,
      orderId
    };
  }
};