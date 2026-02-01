import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// Thêm import icon MessageSquare và Send
import { ArrowLeft, Edit, Star, Package, User, Calendar, Image as ImageIcon, MessageSquare, Send } from 'lucide-react';
import * as adminApi from '../utils/adminApi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE MỚI CHO TÍNH NĂNG TRẢ LỜI ---
  const [replyingId, setReplyingId] = useState(null); // ID của review đang được trả lời
  const [replyText, setReplyText] = useState(''); // Nội dung trả lời
  const [submitting, setSubmitting] = useState(false); // Trạng thái đang gửi

  useEffect(() => {
    fetchData();
  }, [id]); // Sửa lại dependency chỉ phụ thuộc id để tránh loop nếu navigate thay đổi

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, revRes] = await Promise.all([
        adminApi.getProductById(id),
        adminApi.getProductReviews(id).catch(() => ({ data: { reviews: [] } }))
      ]);

      const prodData = prodRes.data.product || prodRes.data.data || prodRes.data;
      const revData = revRes.data.reviews || revRes.data || [];

      setProduct(prodData);
      setReviews(revData);
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Không thể tải thông tin sản phẩm");
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ GỬI TRẢ LỜI ---
  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return alert("Vui lòng nhập nội dung!");
    
    try {
      setSubmitting(true);
      // Gọi API trả lời (đảm bảo bạn đã thêm hàm replyReview vào adminApi.js)
      await adminApi.replyReview(reviewId, replyText);
      alert("Đã trả lời thành công!");
      
      // Reset form và load lại dữ liệu để hiện câu trả lời mới
      setReplyingId(null);
      setReplyText('');
      fetchData(); 
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>;
  if (!product) return <div className="p-10 text-center text-red-500">Không tìm thấy sản phẩm</div>;

  const getDisplayName = (obj) => obj?.displayName || obj?.name || '---';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/products" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
            <p className="text-sm text-gray-500">ID: {product._id}</p>
          </div>
        </div>
        <Link 
          to={`/edit-product/${product._id}`} 
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition"
        >
          <Edit className="w-4 h-4" /> Chỉnh sửa
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- CỘT TRÁI: THÔNG TIN CHÍNH --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Thông tin chung */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b text-gray-800">Thông tin chung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500 block mb-1">Tên sản phẩm</label>
                <p className="font-semibold text-gray-900 text-lg">{product.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Giá bán</label>
                <p className="font-bold text-blue-600 text-lg">
                  {Number(product.price).toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Phân loại</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {getDisplayName(product.mainType)}
                  </span>
                  <span className="text-gray-300">/</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {getDisplayName(product.productType)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">Thương hiệu</label>
                <p className="font-medium text-gray-800">{getDisplayName(product.brand)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="text-sm text-gray-500 block mb-2">Mô tả sản phẩm</label>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-line border border-gray-100">
                {product.description || "Chưa có mô tả."}
              </div>
            </div>
          </div>

          {/* 2. Kho hàng & Kích cỡ */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <Package className="w-5 h-5 text-blue-500" /> Kho hàng & Kích cỡ
            </h2>
            <div className="overflow-hidden border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                  <tr>
                    <th className="px-6 py-3">Kích cỡ (Size)</th>
                    <th className="px-6 py-3">Số lượng tồn kho</th>
                    <th className="px-6 py-3 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product.sizes?.length > 0 ? (
                    product.sizes.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{item.size}</td>
                        <td className="px-6 py-3">{item.stock}</td>
                        <td className="px-6 py-3 text-center">
                          {item.stock > 0 ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Còn hàng
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Hết hàng
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Không có thông tin kích cỡ</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Đánh giá khách hàng */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                <Star className="w-5 h-5 text-yellow-500 fill-current" /> Đánh giá từ khách hàng
              </h2>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {reviews.length} đánh giá
              </span>
            </div>
            
            {/* Tổng quan rating */}
            <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-center px-4 border-r border-gray-200 min-w-[120px]">
                <div className="text-4xl font-bold text-gray-900">{product.ratings ? product.ratings.toFixed(1) : 0}</div>
                <div className="flex text-yellow-400 text-sm mt-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratings || 0) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2 font-medium">Thống kê chi tiết:</p>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter(r => Math.round(r.rating) === star).length;
                    const percent = reviews.length ? (count / reviews.length) * 100 : 0;
                    
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="w-12 text-xs font-medium whitespace-nowrap">{star} sao</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="w-6 text-right text-xs text-gray-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Danh sách review */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {rev.userId?.avatar ? (
                            <img src={rev.userId.avatar} alt="user" className="w-full h-full object-cover"/>
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{rev.userId?.name || 'Khách hàng ẩn danh'}</p>
                          <div className="flex text-yellow-400 text-xs mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(rev.createdAt || rev.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    
                    {/* Nội dung đánh giá của khách */}
                    <p className="text-gray-700 text-sm leading-relaxed pl-13 mb-3">{rev.comment}</p>

                    {/* --- PHẦN TRẢ LỜI CỦA ADMIN (MỚI THÊM) --- */}
                    <div className="pl-13">
                      {rev.adminReply?.comment ? (
                        // Nếu đã trả lời rồi -> Hiển thị khung trả lời
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Admin</span>
                            <span className="text-xs text-gray-500">
                                {rev.adminReply.date ? new Date(rev.adminReply.date).toLocaleDateString('vi-VN') : 'Vừa xong'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{rev.adminReply.comment}</p>
                        </div>
                      ) : (
                        // Nếu chưa trả lời -> Hiển thị nút hoặc form
                        <>
                          {replyingId === rev._id ? (
                            // Form nhập liệu
                            <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                              <textarea
                                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                                rows="3"
                                placeholder="Nhập câu trả lời của bạn..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                autoFocus
                              ></textarea>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleReplySubmit(rev._id)}
                                  disabled={submitting}
                                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                                >
                                  {submitting ? 'Đang gửi...' : <><Send size={14}/> Gửi</>}
                                </button>
                                <button 
                                  onClick={() => { setReplyingId(null); setReplyText(''); }}
                                  className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-md text-sm hover:bg-gray-200"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Nút kích hoạt trả lời
                            <button 
                              onClick={() => { setReplyingId(rev._id); setReplyText(''); }}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline mt-2"
                            >
                              <MessageSquare size={14} /> Trả lời
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {/* --- KẾT THÚC PHẦN TRẢ LỜI --- */}

                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* --- CỘT PHẢI: HÌNH ẢNH & THUỘC TÍNH --- */}
        <div className="space-y-6">
          
          {/* Hình ảnh */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
              <ImageIcon className="w-5 h-5 text-purple-500" /> Thư viện ảnh
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {product.images?.length > 0 ? (
                product.images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group">
                    <img 
                      src={img.url} 
                      alt={`product-${idx}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  Chưa cập nhật hình ảnh
                </div>
              )}
            </div>
          </div>

          {/* Thuộc tính khác */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4 text-gray-800">Thuộc tính bổ sung</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-gray-500">Giới tính</span>
                <span className="font-medium capitalize bg-gray-100 px-2 py-1 rounded text-gray-700">
                  {product.gender === 'men' ? 'Nam' : product.gender === 'women' ? 'Nữ' : 'Unisex'}
                </span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-gray-500">Độ tuổi</span>
                <span className="font-medium capitalize bg-gray-100 px-2 py-1 rounded text-gray-700">
                  {product.age === 'adults' ? 'Người lớn' : 'Trẻ em'}
                </span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-gray-500">Sản phẩm Bán chạy</span>
                <span className={`font-bold ${product.bestSeller ? "text-green-600" : "text-gray-400"}`}>
                  {product.bestSeller ? 'Có' : 'Không'}
                </span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className="text-gray-500">Sản phẩm Nổi bật</span>
                <span className={`font-bold ${product.featured ? "text-blue-600" : "text-gray-400"}`}>
                  {product.featured ? 'Có' : 'Không'}
                </span>
              </li>
            </ul>
          </div>
          
          {/* Metadata */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-500 space-y-1">
            <p>Ngày tạo: {new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
            <p>Cập nhật cuối: {new Date(product.updatedAt).toLocaleDateString('vi-VN')}</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetail;