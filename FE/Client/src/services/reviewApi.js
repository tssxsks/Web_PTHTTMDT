import api from './api'; // Import instance axios chuẩn (giống productApi)

// Lấy danh sách review theo productId
// Backend route: /api/reviews/:productId
// Vì api import từ './api' đã có sẵn prefix '/api' (dựa theo productApi), nên ở đây chỉ cần '/reviews/...'
export const getReviews = (productId) => {
    return api.get(`/reviews/${productId}`);
};

// Thêm review mới
// Backend route: /api/reviews
export const addReview = (data) => {
    return api.post('/reviews', data);
};

// Xóa review (nếu cần)
export const deleteReview = (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
};