import api from './api';

// Lấy giỏ hàng
export const getUserCart = () => {
  return api.get('/cart');
};

// Thêm vào giỏ hàng
export const addToCart = (productId, size, quantity) => {
  return api.post('/cart/add', { productId, size, quantity });
};

// Cập nhật giỏ hàng
export const updateCart = (productId, size, quantity) => {
  return api.put('/cart/update', { productId, size, quantity });
};

// Xóa khỏi giỏ hàng
export const removeFromCart = (productId, size) => {
  return api.post('/cart/remove', { productId, size });
};

// Xóa toàn bộ giỏ hàng
export const clearCart = () => {
  return api.post('/cart/clear');
};
