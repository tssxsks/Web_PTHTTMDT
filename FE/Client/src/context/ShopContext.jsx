import React, { createContext, useEffect, useState } from 'react';
import * as productApi from '../services/productApi';
import * as cartApi from '../services/cartApi';
import * as userApi from '../services/userApi';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sản phẩm khi app load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getProducts();
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch user profile và giỏ hàng khi có token
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const [profileRes, cartRes] = await Promise.all([
          userApi.getUserProfile(),
          cartApi.getUserCart()
        ]);
        setUser(profileRes.data.user);
        setCartItems(cartRes.data.cart?.items || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    };

    fetchUserData();
  }, [token]);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const response = await userApi.loginUser(email, password);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Đăng nhập thất bại' };
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCartItems([]);
  };

  // Cập nhật thông tin người dùng
  const updateUserInfo = (userData) => {
    setUser(userData);
  };

  // Đăng ký
  const register = async (name, email, password) => {
    try {
      const response = await userApi.registerUser(name, email, password);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Đăng ký thất bại' };
    }
  };

  // Thêm vào giỏ hàng
  const addToCart = async (productId, size, quantity = 1) => {
    if (!token) return { success: false, error: 'Vui lòng đăng nhập' };

    try {
      const response = await cartApi.addToCart(productId, size, quantity);
      setCartItems(response.data.cart?.items || []);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng' };
    }
  };

  // Cập nhật giỏ hàng
  const updateCartItem = async (productId, size, quantity) => {
    if (!token) return;

    try {
      const response = await cartApi.updateCart(productId, size, quantity);
      setCartItems(response.data.cart?.items || []);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  // Xóa khỏi giỏ hàng
  const removeFromCart = async (productId, size) => {
    if (!token) return;

    try {
      const response = await cartApi.removeFromCart(productId, size);
      setCartItems(response.data.cart?.items || []);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Lấy tổng tiền
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Backend returns populated product object in item.product
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Lấy tổng số lượng
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Tìm kiếm sản phẩm
  const searchProducts = async (query) => {
    try {
      const response = await productApi.searchProducts(query);
      return response.data.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };

  // Lấy sản phẩm theo danh mục
  const getProductsByCategory = async (category, subCategory) => {
    try {
      const response = await productApi.getProductsByCategory(category, subCategory);
      return response.data.products || [];
    } catch (error) {
      console.error('Error fetching category products:', error);
      return [];
    }
  };

  // Lấy sản phẩm bán chạy
  const getBestsellerProducts = async () => {
    try {
      const response = await productApi.getBestsellerProducts();
      return response.data.products || [];
    } catch (error) {
      console.error('Error fetching bestseller products:', error);
      return [];
    }
  };

  const value = {
    products,
    cartItems,
    user,
    token,
    loading,
    error,
    login,
    logout,
    register,
    updateUserInfo,
    addToCart,
    updateCartItem,
    removeFromCart,
    getTotalPrice,
    getTotalQuantity,
    searchProducts,
    getProductsByCategory,
    getBestsellerProducts,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const context = React.useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};

export default ShopProvider;
