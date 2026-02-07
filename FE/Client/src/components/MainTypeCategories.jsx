import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as productApi from '../services/productApi';

const MainTypeCategories = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMainTypes = async () => {
      try {
        const response = await productApi.getMainTypes();
        setMainTypes(response?.data?.mainTypes || []);
      } catch (error) {
        console.error('Error fetching main types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMainTypes();
  }, []);

  const handleCategoryClick = (mainTypeId) => {
    window.scrollTo(0, 0);
    navigate(`/collection?mainType=${mainTypeId}`);
  };

  const scroll = (direction) => {
    const container = document.getElementById('categories-scroll');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mainTypes.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Danh Mục Sản Phẩm
        </h2>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-5 gap-6">
          {mainTypes.map((mainType) => (
            <div
              key={mainType._id}
              onClick={() => handleCategoryClick(mainType._id)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-white shadow-sm hover:shadow-lg transition-shadow">
                {mainType.imageUrl ? (
                  <img
                    src={mainType.imageUrl}
                    alt={mainType.displayName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400">Chưa có ảnh</span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-end p-3">
                  <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-gray-800" />
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                {mainType.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Carousel View */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Scroll Container */}
            <div
              id="categories-scroll"
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {mainTypes.map((mainType) => (
                <div
                  key={mainType._id}
                  onClick={() => handleCategoryClick(mainType._id)}
                  className="group cursor-pointer flex-shrink-0 w-40 sm:w-48"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 aspect-square bg-white shadow-sm hover:shadow-lg transition-shadow">
                    {mainType.imageUrl ? (
                      <img
                        src={mainType.imageUrl}
                        alt={mainType.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-end p-3">
                      <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-5 h-5 text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-center text-gray-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                    {mainType.displayName}
                  </h3>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 hidden sm:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 hidden sm:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTypeCategories;
