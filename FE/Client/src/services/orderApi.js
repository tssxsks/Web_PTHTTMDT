import api from './api';

// Đặt hàng COD
export const placeOrder = (orderData) => {
  return api.post('/order/cod', orderData);
};

// Thanh toán Stripe
export const placeOrderStripe = (orderData) => {
  return api.post('/order/stripe', orderData);
};

// Verify Stripe
export const verifyStripe = (sessionId) => {
  return api.post('/order/stripe/verify', { sessionId });
};

// Thanh toán Razorpay
export const placeOrderRazorpay = (orderData) => {
  return api.post('/order/razorpay', orderData);
};

// Verify Razorpay
export const verifyRazorpay = (paymentId, orderId, signature) => {
  return api.post('/order/razorpay/verify', { 
    razorpay_payment_id: paymentId, 
    razorpay_order_id: orderId, 
    razorpay_signature: signature 
  });
};

// Thanh toán VNPay
export const placeOrderVnpay = (orderData) => {
  return api.post('/order/vnpay', orderData);
};

// Thanh toán Momo
export const placeOrderMomo = (orderData) => {
  return api.post('/order/momo', orderData);
};

// Thanh toán Solana
export const placeOrderSolana = (orderData) => {
  return api.post('/order/solana', orderData);
};

// Lấy danh sách đơn hàng
export const getUserOrders = () => {
  return api.get('/order');
};

// Lấy chi tiết đơn hàng
export const getOrderById = (orderId) => {
  return api.get(`/order/${orderId}`);
};

// Yêu cầu trả hàng
export const requestReturnOrder = (orderId, reason) => {
  return api.post('/order/return', { orderId, reason });
};
