import Order from '../models/orderModel.js';
import { createMomoHash } from '../utils/crypto.js';
import { placeOrder } from './orderService.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Create Momo payment request
 * @param {ObjectId} userId - User ID
 * @param {Object} paymentData - Payment data
 * @returns {Object} Payment URL and order ID
 */
export const createMomoPayment = async (userId, paymentData) => {
  const { shippingAddress, contactInfo, returnUrl, notifyUrl } = paymentData;

  // Create temporary order
  const orderResult = await placeOrder(userId, {
    shippingAddress,
    contactInfo,
    paymentMethod: 'Momo'
  });

  const order = orderResult.order;

  // Momo parameters
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const requestId = `REQ-${Date.now()}`;
  const orderId = order._id.toString();
  const orderInfo = `Thanh toan don hang #${orderId}`;
  const redirectUrl = returnUrl;
  const ipnUrl = notifyUrl;
  const amount = order.totalPrice;
  const extraData = '';
  const requestType = 'captureWallet';

  // Build raw signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  // Create signature
  const signature = createMomoHash(rawSignature, secretKey);

  // Create request body
  const requestBody = {
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'vi'
  };

  // Send request to Momo
  try {
    const response = await axios.post(
      'https://test-payment.momo.vn/v2/gateway/api/create',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
        }
      }
    );

    const responseData = response.data;
    
    if (responseData.resultCode === 0) {
      return {
        success: true,
        paymentUrl: responseData.payUrl,
        orderId
      };
    } else {
      throw new Error(responseData.message);
    }
  } catch (error) {
    throw new Error(`Momo payment error: ${error.message}`);
  }
};

/**
 * Handle Momo IPN (Instant Payment Notification)
 * @param {Object} ipnData - Momo IPN data
 * @returns {Object} IPN result
 */
export const handleMomoIPN = async (ipnData) => {
  // Verify signature
  const secretKey = process.env.MOMO_SECRET_KEY;
  const { 
    partnerCode, 
    accessKey, 
    requestId, 
    amount, 
    orderId, 
    orderInfo, 
    orderType, 
    transId, 
    resultCode, 
    message, 
    payType, 
    responseTime, 
    extraData, 
    signature 
  } = ipnData;

  // Build raw signature
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  
  // Create signature
  const calculatedSignature = createMomoHash(rawSignature, secretKey);
  
  if (calculatedSignature !== signature) {
    return {
      message: 'Invalid signature',
      resultCode: 1
    };
  }
  
  // Process payment result
  if (resultCode === 0) {
    // Find order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return {
        message: 'Order not found',
        resultCode: 1
      };
    }
    
    // Update order if not already paid
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: transId,
        status: 'Completed',
        update_time: new Date(responseTime).toISOString(),
        transaction_id: transId,
        payment_provider: 'Momo'
      };
      
      await order.save();
    }
  }
  
  // Return success to Momo
  return {
    message: 'Successfully processed',
    resultCode: 0
  };
};