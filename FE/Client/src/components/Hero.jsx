import React from 'react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Giày Dép Chất Lượng Cao
          </h1>

          <p className="text-base mb-4 text-gray-200 max-w-xl">
            Khám phá bộ sưu tập giày dép chính hãng, đa dạng phong cách cho mọi nhu cầu.
          </p>

          <button className="bg-white text-primary font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-100 transition">
            Mua sắm ngay
          </button>
        </div>

        <div className="flex-1 text-center hidden md:block">
          <div className="text-6xl">👟</div>
        </div>
      </div>
    </div>
  );
};


export default Hero;
