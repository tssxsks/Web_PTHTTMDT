import Order from '../models/orderModel.js';
import { getPagination } from '../utils/pagination.js';

/**
 * Get all orders with filtering and pagination (admin)
 * @param {Object} query - Query parameters (page, limit, status, etc.)
 * @returns {Object} Orders with pagination
 */
export const getAllOrders = async (query) => {
  const { page = 1, limit = 10, status, sortBy = 'createdAt', order = 'desc' } = query;

  // Build filter
  const filter = {};
  if (status) {
    filter.status = status;
  }

  // Count total items
  const totalItems = await Order.countDocuments(filter);

  // Get pagination details
  const pagination = getPagination(page, limit, totalItems);

  // Determine sort
  const sort = {};
  sort[sortBy] = order === 'desc' ? -1 : 1;

  // Find orders
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort(sort)
    .skip(pagination.skip)
    .limit(pagination.limit);

  return {
    success: true,
    pagination,
    orders
  };
};

/**
 * Update order status (admin)
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Object} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }
  
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  order.status = status;
  
  // If status is delivered, update deliveredAt
  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }
  
  await order.save();
  
  return {
    success: true,
    message: 'Order status updated successfully',
    order
  };
};

/**
 * Delete all orders (for development only)
 * @returns {Object} Result
 */
export const deleteAllOrders = async () => {
  await Order.deleteMany({});
  
  return {
    success: true,
    message: 'All orders deleted successfully'
  };
};