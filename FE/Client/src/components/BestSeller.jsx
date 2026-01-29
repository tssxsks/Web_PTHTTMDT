import React from 'react';
import ProductItem from './ProductItem';
import { useShop } from '../context/ShopContext';

const BestSeller = () => {
  const { products } = useShop();
  
  // Lấy sản phẩm bán chạy từ products (giả sử đã được đánh dấu)
  const bestsellerProducts = products.filter(p => p.bestSeller);

  if (bestsellerProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">Sản phẩm bán chạy</h2>
        <p className="text-gray-600">Những sản phẩm được yêu thích nhất của khách hàng</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestsellerProducts.slice(0, 8).map(product => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
