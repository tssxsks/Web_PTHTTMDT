import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Truck, RotateCcw, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';
import * as productApi from '../services/productApi';

const Product = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // Number | null
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart, token } = useShop();

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await productApi.getProductById(id);
        const productData = response?.data?.product ?? response?.data?.data ?? response?.data;

        if (!mounted) return;

        setProduct(productData);

        // Set first size as selected (ensure Number)
        if (productData?.sizes?.length > 0) {
          setSelectedSize(Number(productData.sizes[0].size));
        } else {
          setSelectedSize(null);
        }

        // Reset quantity
        setQuantity(1);
      } catch (error) {
        console.error('Error fetching product:', error);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Find selected size object and stock
  const selectedSizeObj = useMemo(() => {
    if (!product?.sizes?.length || selectedSize == null) return null;
    return product.sizes.find((s) => Number(s.size) === Number(selectedSize)) || null;
  }, [product, selectedSize]);

  const maxStock = selectedSizeObj?.stock ?? 0;

  // Keep quantity valid when size/stock changes
  useEffect(() => {
    if (selectedSize == null) {
      setQuantity(1);
      return;
    }
    if (maxStock > 0 && quantity > maxStock) setQuantity(maxStock);
    if (maxStock === 0) setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize, maxStock]);

  const handleAddToCart = async () => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    if (selectedSize == null) {
      alert('Vui lòng chọn kích cỡ');
      return;
    }
    if (maxStock === 0) {
      alert('Size này đã hết hàng');
      return;
    }

    const safeQty = Math.min(Math.max(1, Number(quantity) || 1), maxStock);

    await addToCart(product._id, Number(selectedSize), Number(safeQty));
    alert('Đã thêm vào giỏ hàng!');
  };

  if (loading) return <div className="flex justify-center py-20">Đang tải...</div>;
  if (!product) return <div className="flex justify-center py-20">Sản phẩm không tồn tại</div>;

  const imageUrl =
    product?.images?.length > 0
      ? product.images[0]?.url
      : product?.image
        ? product.image
        : null;

  const canAddToCart = token && selectedSize != null && maxStock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-200 h-96 md:h-full rounded-lg overflow-hidden flex items-center justify-center text-9xl">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            '👟'
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* MainType / ProductType / Brand (populated from BE) */}
          <div className="text-sm text-gray-600 mb-3 space-y-1">
            <p>
              Nhóm:{' '}
              <span className="font-medium">
                {product.mainType?.displayName || product.mainType?.name || 'Chưa phân loại'}
              </span>
            </p>
            <p>
              Loại:{' '}
              <span className="font-medium">
                {product.productType?.displayName || product.productType?.name || 'Chưa phân loại'}
              </span>
            </p>
            <p>
              Hãng:{' '}
              <span className="font-medium">
                {product.brand?.displayName || product.brand?.name || 'Chưa phân loại'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">(125 đánh giá)</span>
          </div>

          <div className="text-4xl font-bold text-primary mb-2">{formatCurrency(product.price)}</div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block font-bold mb-3">Chọn kích cỡ</label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sizeObj) => {
                  const sizeValue = Number(sizeObj.size);
                  const isSelected = Number(selectedSize) === sizeValue;
                  const isOutOfStock = (sizeObj.stock ?? 0) <= 0;

                  return (
                    <button
                      key={sizeValue}
                      onClick={() => {
                        setSelectedSize(sizeValue);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 border-2 rounded font-medium transition ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-primary'
                      } ${isOutOfStock ? 'opacity-50' : ''}`}
                      title={isOutOfStock ? 'Hết hàng' : `Còn ${sizeObj.stock} sản phẩm`}
                    >
                      {sizeValue}
                    </button>
                  );
                })}
              </div>

              {/* Stock info for selected size */}
              {selectedSize != null && (
                <p className="text-sm text-gray-500 mt-2">
                  Tồn kho size {selectedSize}: <span className="font-medium">{maxStock}</span>
                  {maxStock === 0 && <span className="ml-2 text-red-500 font-medium">Hết hàng</span>}
                </p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-bold mb-3">Số lượng</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded"
                disabled={maxStock === 0}
              >
                -
              </button>

              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10) || 1;
                  const clamped = maxStock > 0 ? Math.min(Math.max(1, v), maxStock) : 1;
                  setQuantity(clamped);
                }}
                className="w-16 text-center border rounded py-1"
                min={1}
                max={maxStock > 0 ? maxStock : 1}
                disabled={maxStock === 0}
              />

              <button
                onClick={() => setQuantity((q) => (maxStock > 0 ? Math.min(q + 1, maxStock) : 1))}
                className="px-3 py-1 border rounded"
                disabled={maxStock === 0}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={selectedSize == null || maxStock === 0}
            className={`w-full py-3 rounded-lg font-bold transition mb-4 ${
              selectedSize == null || maxStock === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {selectedSize == null
              ? 'Vui lòng chọn size'
              : maxStock === 0
                ? 'Hết hàng (size này)'
                : 'Thêm vào giỏ hàng'}
          </button>

          <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition mb-8 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" /> Yêu thích
          </button>

          {/* Policy Info */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex gap-3">
              <Truck className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-bold">Giao hàng nhanh</p>
                <p className="text-sm text-gray-600">Giao hàng miễn phí cho đơn hàng trên 500k</p>
              </div>
            </div>
            <div className="flex gap-3">
              <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-bold">Đổi trả dễ dàng</p>
                <p className="text-sm text-gray-600">Đổi trả miễn phí trong 30 ngày</p>
              </div>
            </div>

            {/* Optional: hint when not logged in */}
            {!token && (
              <p className="text-sm text-gray-500">
                Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
