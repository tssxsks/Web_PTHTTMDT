import React from 'react';
import ProductItem from './ProductItem';
import { useShop } from '../context/ShopContext';

const LatestCollection = () => {
  const { products } = useShop();
  
  // Lấy 8 sản phẩm mới nhất (được sắp xếp từ context)
  const latestProducts = products.slice(0, 8);

  if (latestProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">Bộ sưu tập mới</h2>
        <p className="text-gray-600">Những sản phẩm giày dép mới nhất từ các thương hiệu hàng đầu</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latestProducts.map(product => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
