import api from './api';

// Đăng ký
export const registerUser = (name, email, password) => {
  return api.post('/user/register', { name, email, password });
};

// Đăng nhập
export const loginUser = (email, password) => {
  return api.post('/user/login', { email, password });
};

// Lấy profile người dùng
export const getUserProfile = () => {
  return api.get('/user/profile');
};

// Cập nhật profile
export const updateUserProfile = (profileData) => {
  return api.put('/user/profile', profileData);
};

// Thay đổi mật khẩu
export const changePassword = (oldPassword, newPassword) => {
  return api.post('/user/change-password', { oldPassword, newPassword });
};
