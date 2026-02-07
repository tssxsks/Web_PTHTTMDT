import React from 'react';
import { useShop } from '../context/ShopContext';
import Hero from '../components/Hero';
import Banner from '../components/Banner';
import MainTypeCategories from '../components/MainTypeCategories';
import LatestCollection from '../components/LatestCollection';
// import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';

const Home = () => {
  const { loading, error, products } = useShop();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <Banner />
      <MainTypeCategories />
      {products.length > 0 ? (
        <>
          <LatestCollection />
          {/* <BestSeller /> */}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-96">
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      )}
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
