import React from 'react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Giày Dép Chất Lượng Cao
          </h1>
          <p className="text-lg mb-6 text-gray-200">
            Khám phá bộ sưu tập giày dép đa dạng từ các thương hiệu nổi tiếng thế giới.
          </p>
          <button className="bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition">
            Mua sắm ngay
          </button>
        </div>
        <div className="flex-1 text-center">
          <div className="text-8xl">👟</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
