import api from './api';

const BANNER_API = '/banner';

/**
 * ADMIN
 */

// Lấy tất cả banner (admin)
export const getAllBanners = async () => {
  const res = await api.get(BANNER_API);
  return res.data;
};

// Lấy banner theo id
export const getBannerById = async (id) => {
  const res = await api.get(`${BANNER_API}/${id}`);
  return res.data;
};

// Tạo banner (multipart/form-data)
export const createBanner = async (bannerData) => {
  const formData = new FormData();

  formData.append('title', bannerData.title);
  formData.append('link', bannerData.link);
  formData.append('description', bannerData.description || '');
  formData.append('priority', bannerData.priority || 0);
  formData.append('startDate', bannerData.startDate);

  if (bannerData.endDate) {
    formData.append('endDate', bannerData.endDate);
  }

  if (bannerData.image instanceof File) {
    formData.append('image', bannerData.image);
  }

  const res = await api.post(BANNER_API, formData);
  return res.data;
};

// Cập nhật banner
export const updateBanner = async (id, bannerData) => {
  const formData = new FormData();

  formData.append('title', bannerData.title);
  formData.append('link', bannerData.link);
  formData.append('description', bannerData.description || '');
  formData.append('priority', bannerData.priority || 0);
  formData.append('isActive', bannerData.isActive);
  formData.append('startDate', bannerData.startDate);

  if (bannerData.endDate) {
    formData.append('endDate', bannerData.endDate);
  }

  if (bannerData.image instanceof File) {
    formData.append('image', bannerData.image);
  }

  const res = await api.put(`${BANNER_API}/${id}`, formData);
  return res.data;
};

// Xóa banner
export const deleteBanner = async (id) => {
  const res = await api.delete(`${BANNER_API}/${id}`);
  return res.data;
};

// Toggle trạng thái banner
export const toggleBannerStatus = async (id) => {
  const res = await api.patch(`${BANNER_API}/${id}/toggle`);
  return res.data;
};

/**
 * PUBLIC
 */

// Lấy banner đang active (client)
export const getActiveBanners = async () => {
  const res = await api.get(`${BANNER_API}/active`);
  return res.data;
};
