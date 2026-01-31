import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';

const ProductItem = ({ product }) => {
  const { addToCart, token } = useShop();
  
  // Logic chọn size mặc định (giữ nguyên của bạn)
  const [selectedSize, setSelectedSize] = React.useState(
    (product.sizes?.[0]?.size || product.sizes?.[0]) || ''
  );

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Chặn Link click
    if (!token) {
      window.location.href = '/login'; // Hoặc navigate('/login')
      return;
    }
    await addToCart(product._id, selectedSize, 1);
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition h-full flex flex-col">
        {/* Phần Ảnh */}
        <div className="relative overflow-hidden bg-gray-200 h-64 group">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0].url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          ) : product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">👟</div>
          )}
          
          {/* Tag Bán chạy */}
          {product.bestSeller && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              Best Seller
            </div>
          )}
        </div>

        {/* Phần Thông tin */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-800 mb-1 truncate" title={product.name}>
            {product.name}
          </h3>
          
          {/* Hiển thị loại sản phẩm (nếu có populate) hoặc category text */}
          <p className="text-gray-500 text-xs mb-3">
            {product.productType?.displayName || product.productType?.name || product.category || 'Sản phẩm'}
          </p>

          <div className="flex items-center justify-between mb-3 mt-auto">
            <p className="text-primary font-bold text-lg">{formatCurrency(product.price)}</p>
            
            {/* --- PHẦN RATING ĐƯỢC SỬA --- */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">
                {product.ratings ? product.ratings.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs text-gray-400">
                ({product.numReviews || 0})
              </span>
            </div>
            {/* --------------------------- */}
          </div>

          {/* Chọn Size (Giữ nguyên) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <select 
                onClick={(e) => e.preventDefault()}
                onChange={(e) => setSelectedSize(e.target.value)}
                value={selectedSize}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:border-primary outline-none"
              >
                {product.sizes.map((sizeObj, idx) => (
                  <option key={idx} value={sizeObj.size || sizeObj}>
                    Size {sizeObj.size || sizeObj}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition flex items-center justify-center gap-2 font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;