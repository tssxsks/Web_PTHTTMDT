import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as bannerApi from '../services/bannerApi';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerApi.getActiveBanners();
        setBanners(data.banners || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />;
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = () => {
    if (currentBanner.link) {
      // Check if link is external or internal
      if (currentBanner.link.startsWith('http')) {
        window.open(currentBanner.link, '_blank');
      } else {
        window.scrollTo(0, 0);
        navigate(currentBanner.link);
      }
    }
  };

  const BannerIntro = () => (
    <div className="py-10 text-center bg-white">
      <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">
        Ưu đãi nổi bật hôm nay
      </h2>
      <p className="text-gray-600">
        Khám phá những chương trình khuyến mãi và bộ sưu tập mới nhất
      </p>
    </div>
  );

  return (
    <div>
      <BannerIntro />
      <div className="relative w-full h-96 overflow-hidden rounded-lg">
        {/* Banner Image */}
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          onClick={handleBannerClick}
        />

        {/* Banner Text Overlay */}
        {currentBanner.title && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h2 className="text-4xl font-bold mb-2">{currentBanner.title}</h2>
              {currentBanner.description && (
                <p className="text-lg mb-4">{currentBanner.description}</p>
              )}
              <button
                onClick={handleBannerClick}
                className="bg-white text-black px-8 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Xem Chi Tiết
              </button>
            </div>
          </div>
        )}

        {/* Previous Button */}
        {banners.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition z-10"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>
        )}

        {/* Next Button */}
        {banners.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition z-10"
          >
            <ChevronRight size={24} className="text-black" />
          </button>
        )}

        {/* Dot Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-3 hover:bg-white/75'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
