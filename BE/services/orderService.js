import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

/**
 * Place a new order with COD payment
 * @param {ObjectId} userId - User ID
 * @param {Object} orderData - Order data (shipping, contact, payment)
 * @returns {Object} Order result
 */
export const placeOrder = async (userId, orderData) => {
  const { shippingAddress, contactInfo, paymentMethod = 'COD' } = orderData;

  // Get user and cart
  const user = await User.findById(userId)
    .populate({
      path: 'cart.items.product',
      select: 'name images price sizes'
    });

  if (!user.cart || !user.cart.items || user.cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // Validate stock availability and prepare order items
  const orderItems = [];
  for (const item of user.cart.items) {
    const product = item.product;
    
    // Find size in product
    const sizeObj = product.sizes.find(s => s.size === item.size);
    
    if (!sizeObj) {
      throw new Error(`Size ${item.size} is not available for ${product.name}`);
    }
    
    if (sizeObj.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name} in size ${item.size}`);
    }
    
    // Add item to order
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      size: item.size,
      quantity: item.quantity,
      price: product.price
    });
    
    // Update product stock
    sizeObj.stock -= item.quantity;
    await product.save();
  }
  
  // Calculate prices
  const itemsPrice = user.cart.totalAmount;
  const shippingPrice = itemsPrice > 1000000 ? 0 : 30000; // Free shipping over 1M VND
  const taxPrice = Math.round(itemsPrice * 0.1); // 10% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    contactInfo,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: paymentMethod === 'COD' ? false : true,
    paidAt: paymentMethod === 'COD' ? null : Date.now(),
  });
  
  // Clear user cart
  user.cart.items = [];
  user.cart.totalAmount = 0;
  await user.save();
  
  return {
    success: true,
    message: 'Order placed successfully',
    order
  };
};