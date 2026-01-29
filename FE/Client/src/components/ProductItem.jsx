import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';

const ProductItem = ({ product }) => {
  const { addToCart, token } = useShop();
  const [selectedSize, setSelectedSize] = React.useState(
    (product.sizes?.[0]?.size || product.sizes?.[0]) || ''
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    await addToCart(product._id, selectedSize, 1);
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="relative overflow-hidden bg-gray-200 h-64">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0].url} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition"
            />
          ) : product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-110 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">👟</div>
          )}
          {product.bestSeller && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded text-xs font-bold">
              Bán chạy
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{product.category}</p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-primary font-bold text-lg">{formatCurrency(product.price)}</p>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm text-gray-700">(45)</span>
            </div>
          </div>
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <select 
                onClick={(e) => e.preventDefault()}
                onChange={(e) => setSelectedSize(e.target.value)}
                value={selectedSize}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
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
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition flex items-center justify-center gap-2"
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
