import api from '../utils/api';

// Đăng nhập admin
export const adminLogin = (email, password) => {
  return api.post('/user/admin/login', { email, password });
};

// ===== PRODUCT =====
// Thêm sản phẩm
export const addProduct = (productData) => {
  return api.post('/product', productData);
};

// Cập nhật sản phẩm
export const updateProduct = (id, productData) => {
  return api.put(`/product/${id}`, productData);
};

// Xóa sản phẩm
export const deleteProduct = (id) => {
  return api.delete(`/product/${id}`);
};

// Lấy danh sách sản phẩm
export const getProducts = () => {
  return api.get('/product');
};

// Lấy chi tiết sản phẩm
export const getProductById = (id) => {
  return api.get(`/product/${id}`);
};

// ===== MAIN TYPE =====
// Lấy danh sách loại chính
export const getAllMainTypes = () => {
  return api.get('/maintype');
};

// Lấy chi tiết loại chính
export const getMainTypeById = (id) => {
  return api.get(`/maintype/${id}`);
};

// Thêm loại chính
export const addMainType = (data) => {
  return api.post('/maintype', data);
};

// Cập nhật loại chính
export const updateMainType = (id, data) => {
  return api.put(`/maintype/${id}`, data);
};

// Xóa loại chính
export const deleteMainType = (id) => {
  return api.delete(`/maintype/${id}`);
};

// ===== PRODUCT TYPE =====
// Lấy danh sách loại sản phẩm
export const getAllProductTypes = (mainTypeId = null) => {
  const params = mainTypeId ? { mainType: mainTypeId } : {};
  return api.get('/producttype', { params });
};

// Lấy chi tiết loại sản phẩm
export const getProductTypeById = (id) => {
  return api.get(`/producttype/${id}`);
};

// Thêm loại sản phẩm
export const addProductType = (data) => {
  return api.post('/producttype', data);
};

// Cập nhật loại sản phẩm
export const updateProductType = (id, data) => {
  return api.put(`/producttype/${id}`, data);
};

// Xóa loại sản phẩm
export const deleteProductType = (id) => {
  return api.delete(`/producttype/${id}`);
};

// ===== BRAND =====
// Lấy danh sách hãng
export const getAllBrands = (mainTypeId = null) => {
  const params = mainTypeId ? { mainType: mainTypeId } : {};
  return api.get('/brand', { params });
};

// Lấy chi tiết hãng
export const getBrandById = (id) => {
  return api.get(`/brand/${id}`);
};

// Thêm hãng
export const addBrand = (data) => {
  return api.post('/brand', data);
};

// Cập nhật hãng
export const updateBrand = (id, data) => {
  return api.put(`/brand/${id}`, data);
};

// Xóa hãng
export const deleteBrand = (id) => {
  return api.delete(`/brand/${id}`);
};

// ===== SIZE =====
// Lấy danh sách kích cỡ
export const getAllSizes = (mainTypeId = null) => {
  const params = mainTypeId ? { mainType: mainTypeId } : {};
  return api.get('/size', { params });
};

// Lấy chi tiết kích cỡ
export const getSizeById = (id) => {
  return api.get(`/size/${id}`);
};

// Thêm kích cỡ
export const addSize = (data) => {
  return api.post('/size', data);
};

// Cập nhật kích cỡ
export const updateSize = (id, data) => {
  return api.put(`/size/${id}`, data);
};

// Xóa kích cỡ
export const deleteSize = (id) => {
  return api.delete(`/size/${id}`);
};

// ===== ORDER =====
// Lấy danh sách đơn hàng
export const getAllOrders = () => {
  return api.get('/order/admin/all');
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/order/admin/status/${orderId}`, { status });
};

// Xóa tất cả đơn hàng
export const deleteAllOrders = () => {
  return api.delete('/order/admin/all');
};

// ===== REVENUE =====
// Lấy doanh thu theo ngày
export const getRevenueByDay = (startDate, endDate) => {
  return api.get('/order/revenue-by-day', { params: { startDate, endDate } });
};

// Lấy doanh thu theo tháng
export const getRevenueByMonth = (year) => {
  return api.get(`/order/revenue-by-month?year=${year}`);
};

// Lấy doanh thu theo sản phẩm
export const getRevenueByProduct = () => {
  return api.get('/order/revenue-by-product');
};
