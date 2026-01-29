import Order from '../models/orderModel.js';
import { getPagination } from '../utils/pagination.js';

/**
 * Request return/refund for an order
 * @param {string} orderId - Order ID
 * @param {string} reason - Return reason
 * @param {ObjectId} userId - User ID
 * @returns {Object} Result
 */
export const requestReturnOrder = async (orderId, reason, userId) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Verify order belongs to user
  if (order.user.toString() !== userId.toString()) {
    throw new Error('Not authorized to return this order');
  }
  
  // Check if order is delivered
  if (order.status !== 'delivered') {
    throw new Error('Only delivered orders can be returned');
  }
  
  // Check if return already requested
  if (order.returnRequest && order.returnRequest.isRequested) {
    throw new Error('Return already requested for this order');
  }
  
  // Update order with return request
  order.returnRequest = {
    isRequested: true,
    reason: reason,
    status: 'pending',
    requestedAt: Date.now()
  };
  
  await order.save();
  
  return {
    success: true,
    message: 'Return request submitted successfully',
    order
  };
};

/**
 * Process return request (admin)
 * @param {string} orderId - Order ID
 * @param {string} status - Return status (approved/rejected)
 * @returns {Object} Result
 */
export const processReturnOrder = async (orderId, status) => {
  if (status !== 'approved' && status !== 'rejected') {
    throw new Error('Invalid status');
  }
  
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Check if return is requested
  if (!order.returnRequest || !order.returnRequest.isRequested) {
    throw new Error('No return request found for this order');
  }
  
  // Check if return is already processed
  if (order.returnRequest.status !== 'pending') {
    throw new Error('Return request already processed');
  }
  
  // Update return request
  order.returnRequest.status = status;
  order.returnRequest.processedAt = Date.now();
  
  await order.save();
  
  return {
    success: true,
    message: `Return request ${status}`,
    order
  };
};

/**
 * Get return requests (admin)
 * @param {Object} query - Query parameters (page, limit, status)
 * @returns {Object} Return requests with pagination
 */
export const getReturnOrders = async (query) => {
  const { page = 1, limit = 10, status } = query;

  // Build filter
  const filter = {
    'returnRequest.isRequested': true
  };
  
  if (status) {
    filter['returnRequest.status'] = status;
  }

  // Count total items
  const totalItems = await Order.countDocuments(filter);

  // Get pagination details
  const pagination = getPagination(page, limit, totalItems);

  // Find orders with return requests
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ 'returnRequest.requestedAt': -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);

  return {
    success: true,
    pagination,
    orders
  };
};