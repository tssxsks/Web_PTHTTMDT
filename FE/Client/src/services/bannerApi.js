import api from './api';

// Get active banners (for homepage)
export const getActiveBanners = async () => {
  const res = await api.get('/banner/active');
  return res.data;
};

// Get banner by id
export const getBannerById = async (id) => {
  const res = await api.get(`/banner/${id}`);
  return res.data;
};
