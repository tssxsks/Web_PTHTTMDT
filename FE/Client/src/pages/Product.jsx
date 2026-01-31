import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Truck, RotateCcw, Heart, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';
import * as productApi from '../services/productApi';
import * as reviewApi from '../services/reviewApi'; // Import Review API

const Product = () => {
  const { id } = useParams();
  const { addToCart, token } = useShop();

  // --- State hiển thị sản phẩm ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- State giỏ hàng ---
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // --- State cho Review & Tabs ---
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // 1. FETCH DỮ LIỆU (Product + Reviews)
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // --- LẤY SẢN PHẨM ---
        const productRes = await productApi.getProductById(id);
        if (!mounted) return;

        // Logic "bắt dính" dữ liệu để tránh lỗi
        let productData = null;
        if (productRes.data && productRes.data.product) {
            productData = productRes.data.product;
        } else if (productRes.product) {
            productData = productRes.product;
        } else if (productRes.data) {
            productData = productRes.data;
        }

        if (productData) {
            setProduct(productData);
            setCurrentImageIndex(0);
            if (productData.sizes?.length > 0) {
              setSelectedSize(Number(productData.sizes[0].size));
            } else {
              setSelectedSize(null);
            }
            setQuantity(1);
        } else {
            setProduct(null);
        }

        // --- LẤY REVIEW (Không chặn nếu lỗi) ---
        try {
            const reviewRes = await reviewApi.getReviews(id);
            const reviewList = reviewRes.reviews || reviewRes.data?.reviews || [];
            if (mounted) setReviews(reviewList);
        } catch (error) {
            console.warn("Chưa tải được review:", error);
        }

      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [id]);

  // --- Logic Slide Ảnh ---
  const productImages = useMemo(() => {
    if (!product) return [];
    return product.images && product.images.length > 0 
      ? product.images 
      : (product.image ? [{ url: product.image }] : []);
  }, [product]);

  const nextSlide = () => setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));

  useEffect(() => {
    if (productImages.length <= 1) return;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentImageIndex, productImages.length]);

  // --- Logic Giỏ Hàng ---
  const selectedSizeObj = useMemo(() => {
    if (!product?.sizes?.length || selectedSize == null) return null;
    return product.sizes.find((s) => Number(s.size) === Number(selectedSize)) || null;
  }, [product, selectedSize]);

  const maxStock = selectedSizeObj?.stock ?? 0;

  useEffect(() => {
    if (selectedSize == null) setQuantity(1);
    else if (maxStock === 0) setQuantity(1);
    else if (quantity > maxStock) setQuantity(maxStock);
  }, [selectedSize, maxStock]);

  const handleAddToCart = async () => {
    if (!token) { alert('Vui lòng đăng nhập'); return; }
    if (selectedSize == null) { alert('Vui lòng chọn size'); return; }
    if (maxStock === 0) { alert('Size này đã hết hàng'); return; }
    await addToCart(product._id, Number(selectedSize), quantity);
    alert('Đã thêm vào giỏ hàng!');
  };

  // --- Logic Gửi Review ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) { alert('Vui lòng đăng nhập để đánh giá'); return; }
    if (!commentInput.trim()) { alert('Vui lòng nhập nội dung'); return; }

    try {
        setSubmittingReview(true);
        await reviewApi.addReview({
            productId: product._id,
            rating: ratingInput,
            comment: commentInput
        });
        
        // Reload reviews
        const res = await reviewApi.getReviews(product._id);
        const newReviews = res.reviews || res.data?.reviews || [];
        setReviews(newReviews);
        
        setCommentInput('');
        setRatingInput(5);
        alert('Cảm ơn đánh giá của bạn!');
    } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi gửi đánh giá');
    } finally {
        setSubmittingReview(false);
    }
  };

  // Helper render sao
  const renderStars = (rating) => {
     return [...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
     ));
  };

  if (loading) return <div className="flex justify-center py-20">Đang tải...</div>;
  if (!product) return <div className="flex justify-center py-20">Sản phẩm không tồn tại</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* --- PHẦN TRÊN: GIỮ NGUYÊN GIAO DIỆN CŨ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* CỘT TRÁI: SLIDER ẢNH (Không đổi) */}
        <div className="flex flex-col gap-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 aspect-square flex items-center justify-center relative group">
                {productImages.length > 0 ? (
                    <img src={productImages[currentImageIndex].url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-500" />
                ) : (<span className="text-6xl">👟</span>)}

                {productImages.length > 1 && (
                    <>
                    <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100 text-gray-700"><ChevronLeft size={24} /></button>
                    <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100 text-gray-700"><ChevronRight size={24} /></button>
                    </>
                )}
            </div>
            {productImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar px-1">
                    {productImages.map((img, index) => (
                        <button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-primary ring-1 ring-primary scale-105 shadow-sm' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}>
                            <img src={img.url} alt={`View ${index}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* CỘT PHẢI: THÔNG TIN (Đã khôi phục đầy đủ thông tin cũ) */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* KHÔI PHỤC: Thông tin Nhóm/Loại/Hãng */}
          <div className="text-sm text-gray-600 mb-3 space-y-1">
            <p>Nhóm: <span className="font-medium">{product.mainType?.displayName || 'N/A'}</span></p>
            <p>Loại: <span className="font-medium">{product.productType?.displayName || 'N/A'}</span></p>
            <p>Hãng: <span className="font-medium">{product.brand?.name || 'N/A'}</span></p>
          </div>
          
          {/* CẬP NHẬT: Rating dùng dữ liệu thật từ BE */}
          <div className="flex items-center gap-4 mb-4">
             <div className="flex gap-1">
               {renderStars(product.ratings || 0)}
             </div>
             <span className="text-gray-600 text-sm">({product.numReviews || 0} đánh giá)</span>
          </div>

          <div className="text-4xl font-bold text-primary mb-2">{formatCurrency(product.price)}</div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size & Stock UI (Không đổi) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block font-bold mb-3">Chọn kích cỡ</label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sizeObj) => {
                  const sizeValue = Number(sizeObj.size);
                  const isSelected = Number(selectedSize) === sizeValue;
                  const isOutOfStock = (sizeObj.stock ?? 0) <= 0;
                  return (
                    <button key={sizeValue} onClick={() => { setSelectedSize(sizeValue); setQuantity(1); }} className={`px-4 py-2 border-2 rounded font-medium transition ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300 hover:border-primary'} ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isOutOfStock}>
                      {sizeValue}
                    </button>
                  );
                })}
              </div>
              {selectedSize != null && (
                <p className="text-sm text-gray-500 mt-2">Tồn kho size {selectedSize}: <b>{maxStock}</b> {maxStock===0 && <span className="text-red-500">Hết hàng</span>}</p>
              )}
            </div>
          )}

          {/* Quantity & Actions (Không đổi) */}
          <div className="mb-6">
             <label className="block font-bold mb-3">Số lượng</label>
             <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 border rounded hover:bg-gray-100" disabled={maxStock===0}>-</button>
                <input type="number" value={quantity} onChange={(e) => { const v = parseInt(e.target.value, 10) || 1; setQuantity(maxStock > 0 ? Math.min(Math.max(1, v), maxStock) : 1); }} className="w-16 text-center border rounded py-1 outline-none" min={1} max={maxStock} disabled={maxStock===0}/>
                <button onClick={() => setQuantity(q => (maxStock > 0 ? Math.min(q + 1, maxStock) : 1))} className="px-3 py-1 border rounded hover:bg-gray-100" disabled={maxStock===0}>+</button>
             </div>
          </div>

          <button onClick={handleAddToCart} disabled={selectedSize == null || maxStock === 0} className={`w-full py-3 rounded-lg font-bold transition mb-4 ${selectedSize == null || maxStock === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark shadow-lg'}`}>
            {selectedSize == null ? 'Vui lòng chọn size' : maxStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </button>

          <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition mb-8 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" /> Yêu thích
          </button>

          {/* KHÔI PHỤC: Chính sách giao hàng */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex gap-3"><Truck className="w-5 h-5 text-primary" /><div><p className="font-bold">Giao hàng nhanh</p><p className="text-sm text-gray-600">Miễn phí ship đơn {'>'} 500k</p></div></div>
            <div className="flex gap-3"><RotateCcw className="w-5 h-5 text-primary" /><div><p className="font-bold">Đổi trả dễ dàng</p><p className="text-sm text-gray-600">Trong 30 ngày</p></div></div>
          </div>

        </div>
      </div>

      {/* --- PHẦN DƯỚI: TABS REVIEW (MỚI THÊM VÀO) --- */}
      <div className="border-t pt-10">
        <div className="flex gap-8 border-b mb-6">
            <button onClick={() => setActiveTab('description')} className={`pb-4 text-lg font-bold transition ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-800'}`}>Mô tả</button>
            <button onClick={() => setActiveTab('reviews')} className={`pb-4 text-lg font-bold transition ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-800'}`}>Đánh giá ({reviews.length})</button>
        </div>

        <div>
            {activeTab === 'description' ? (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</div>
            ) : (
                <div className="max-w-4xl">
                    {/* Form Review */}
                    <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
                        <h3 className="font-bold text-lg mb-4">Viết đánh giá của bạn</h3>
                        {!token ? (
                            <p className="text-gray-500">Vui lòng <a href="/login" className="text-primary font-medium hover:underline">đăng nhập</a> để đánh giá.</p>
                        ) : (
                            <form onSubmit={handleSubmitReview}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Đánh giá sao:</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" onClick={() => setRatingInput(star)} className="focus:outline-none transition transform hover:scale-110">
                                                <Star className={`w-8 h-8 ${star <= ratingInput ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">Nhận xét:</label>
                                    <textarea rows="3" className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white" placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..." value={commentInput} onChange={(e) => setCommentInput(e.target.value)} required />
                                </div>
                                <button type="submit" disabled={submittingReview} className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark disabled:opacity-50 transition shadow-sm">
                                    {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Danh sách Review */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">Chưa có đánh giá nào. Hãy là người đầu tiên!</p> : reviews.map((rev) => (
                            <div key={rev._id} className="border-b pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 border border-gray-300 overflow-hidden">
                                            {rev.userId?.avatar ? <img src={rev.userId.avatar} className="w-full h-full object-cover" alt="avt" /> : <User size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{rev.userId?.name || 'Người dùng ẩn danh'}</p>
                                            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{new Date(rev.createdAt || rev.date).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{rev.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Product;