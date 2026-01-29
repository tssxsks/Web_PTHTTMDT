import api from './api';

// Lấy danh sách sản phẩm với filters
export const getProducts = (params) => {
  return api.get('/product', { params });
};

// Lấy chi tiết sản phẩm
export const getProductById = (id) => {
  return api.get(`/product/${id}`);
};

// Tìm kiếm sản phẩm
export const searchProducts = (query) => {
  return api.get('/product', { params: { search: query } });
};

// Lọc sản phẩm theo danh mục
export const getProductsByCategory = (category, subCategory) => {
  return api.get('/product', { params: { category, subCategory } });
};

// Lấy sản phẩm bán chạy
export const getBestsellerProducts = () => {
  return api.get('/product', { params: { bestSeller: true } });
};

// Lấy sản phẩm mới
export const getLatestProducts = (limit = 10) => {
  return api.get('/product', { params: { limit, sort: 'newest' } });
};

// Lọc nâng cao theo mainType, productType, gender, brand
export const getFilteredProducts = (filters) => {
  return api.get('/product', { params: filters });
};

// ===== Dynamic Filter Data =====

// Lấy tất cả Main Types (Giày, Dép, v.v)
export const getMainTypes = () => {
  return api.get('/maintype');
};

// Lấy chi tiết Main Type
export const getMainTypeById = (id) => {
  return api.get(`/maintype/${id}`);
};

// Lấy Product Types theo Main Type
export const getProductTypesByMainType = (mainTypeId) => {
  return api.get('/producttype', { params: { mainType: mainTypeId } });
};

// Lấy chi tiết Product Type
export const getProductTypeById = (id) => {
  return api.get(`/producttype/${id}`);
};

// Lấy Brands theo Main Type
export const getBrandsByMainType = (mainTypeId) => {
  return api.get('/brand', { params: { mainType: mainTypeId } });
};

// Lấy chi tiết Brand
export const getBrandById = (id) => {
  return api.get(`/brand/${id}`);
};

