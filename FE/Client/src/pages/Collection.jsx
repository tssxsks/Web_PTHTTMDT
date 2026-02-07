import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import ProductItem from '../components/ProductItem';
import { useShop } from '../context/ShopContext';
import * as productApi from '../services/productApi';
import { AGES, GENDERS } from '../utils/constants';

const PRICE_MIN = 0;
const PRICE_MAX = 10000000;
const PRICE_STEP = 100000;

const Collection = () => {
  const { products } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // Dynamic filter data from BE
  const [mainTypes, setMainTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);

  // Filter values
  const [filters, setFilters] = useState({
    mainType: searchParams.get('mainType') || '',
    productType: searchParams.get('productType') || '',
    age: searchParams.get('age') || '',
    gender: searchParams.get('gender') || '',
    brand: searchParams.get('brand') || '',
    minPrice: parseInt(searchParams.get('minPrice')) || PRICE_MIN,
    maxPrice: parseInt(searchParams.get('maxPrice')) || PRICE_MAX,
  });

  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [expandedFilters, setExpandedFilters] = useState({
    mainType: true,
    productType: true,
    brand: true,
    price: true,
  });
  const [loading, setLoading] = useState(false);

  // Load MainTypes on mount
  useEffect(() => {
    const loadMainTypes = async () => {
      try {
        const response = await productApi.getMainTypes();
        setMainTypes(response?.data?.mainTypes || []);
      } catch (error) {
        console.error('Error loading main types:', error);
        setMainTypes([]);
      }
    };
    loadMainTypes();
  }, []);

  // Load ProductTypes and Brands when MainType changes
  useEffect(() => {
    const loadProductTypesAndBrands = async () => {
      const mainTypeId = filters.mainType;

      // luôn hiện UI, nhưng data chỉ load khi có mainType
      if (!mainTypeId) {
        setProductTypes([]);
        setBrands([]);
        return;
      }

      try {
        const [typesResponse, brandsResponse] = await Promise.all([
          productApi.getProductTypesByMainType(mainTypeId),
          productApi.getBrandsByMainType(mainTypeId),
        ]);

        setProductTypes(typesResponse?.data?.productTypes || []);
        setBrands(brandsResponse?.data?.brands || []);
      } catch (error) {
        console.error('Error loading product types or brands:', error);
        setProductTypes([]);
        setBrands([]);
      }
    };

    loadProductTypesAndBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.mainType]);

  // Fetch products based on filters (excluding price filtering)
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);

        // Build params: exclude price filters (we'll filter on FE)
        const params = Object.fromEntries(
          Object.entries(filters).filter(([k, v]) => {
            if (v === '' || v == null) return false;
            // Exclude price filters from API call
            if (k === 'minPrice' || k === 'maxPrice') return false;
            return true;
          })
        );

        let baseProducts = [];

        if (Object.keys(params).length === 0) {
          // No filters, use all products from context
          baseProducts = [...(products || [])].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else {
          // Call API only for non-price filters
          const response = await productApi.getProducts({ ...params, sort: 'newest' });
          baseProducts = response?.data?.products || [];
        }

        // Apply price filtering on FE
        const priceFiltered = baseProducts.filter((product) => {
          const price = product.price || 0;
          return price >= filters.minPrice && price <= filters.maxPrice;
        });

        setFilteredProducts(priceFiltered);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [
    filters.mainType,
    filters.productType,
    filters.age,
    filters.gender,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    products,
  ]);

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: filters[filterName] === value ? '' : value,
    };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val !== PRICE_MIN && val !== PRICE_MAX) {
        params.set(key, val);
      }
    });
    setSearchParams(params);
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setFilters({
      mainType: '',
      productType: '',
      age: '',
      gender: '',
      brand: '',
      minPrice: PRICE_MIN,
      maxPrice: PRICE_MAX,
    });
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => {
    if (v === '' || v == null) return false;
    if (k === 'minPrice' && Number(v) === PRICE_MIN) return false;
    if (k === 'maxPrice' && Number(v) === PRICE_MAX) return false;
    return true;
  });

  // ====== PRICE RANGE (2-way slider) ======
  const handleMinPriceChange = (val) => {
    const nextMin = Math.max(PRICE_MIN, Math.min(Number(val), filters.maxPrice));
    const newFilters = { ...filters, minPrice: nextMin };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== PRICE_MIN && value !== PRICE_MAX) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleMaxPriceChange = (val) => {
    const nextMax = Math.min(PRICE_MAX, Math.max(Number(val), filters.minPrice));
    const newFilters = { ...filters, maxPrice: nextMax };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== PRICE_MIN && value !== PRICE_MAX) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const minPercent = ((filters.minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((filters.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bộ sưu tập sản phẩm</h1>

      <div className="flex gap-8">
        {/* Sidebar Filter */}
        <div className="w-72 hidden md:block">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Bộ lọc</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Xóa
                </button>
              )}
            </div>

            {/* Main Type Filter */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilterSection('mainType')}
                className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 font-semibold text-left"
              >
                <span>Nhóm sản phẩm (Giày/Dép)</span>
                {expandedFilters.mainType ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedFilters.mainType && (
                <div className="bg-gray-50 rounded mt-2 space-y-2 p-3">
                  {mainTypes.length > 0 ? (
                    mainTypes.map((item) => (
                      <label key={item._id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.mainType === item._id}
                          onChange={() => handleFilterChange('mainType', item._id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{item.displayName || item.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Chưa có nhóm sản phẩm</p>
                  )}
                </div>
              )}
            </div>

            {/* Product Type Filter - luôn hiện, nhưng disabled nếu chưa chọn mainType */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilterSection('productType')}
                className={`w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 font-semibold text-left ${
                  filters.mainType ? 'bg-blue-50' : ''
                }`}
              >
                <span>Loại (Product Type)</span>
                {expandedFilters.productType ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedFilters.productType && (
                <div className="bg-gray-50 rounded mt-2 space-y-2 p-3">
                  {!filters.mainType ? (
                    <p className="text-sm text-gray-500">Chọn “Nhóm” trước để hiện loại</p>
                  ) : productTypes.length > 0 ? (
                    productTypes.map((item) => (
                      <label key={item._id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.productType === item._id}
                          onChange={() => handleFilterChange('productType', item._id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{item.displayName || item.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Không có loại sản phẩm</p>
                  )}
                </div>
              )}
            </div>

            {/* Age Filter */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilterSection('age')}
                className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 font-semibold text-left"
              >
                <span>Dành cho</span>
                {expandedFilters.age ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedFilters.age && (
                <div className="bg-gray-50 rounded mt-2 space-y-2 p-3">
                  {AGES.map((item) => (
                    <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.age === item.value}
                        onChange={() => handleFilterChange('age', item.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{item.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Filter */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilterSection('gender')}
                className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 font-semibold text-left"
              >
                <span>Giới tính</span>
                {expandedFilters.gender ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedFilters.gender && (
                <div className="bg-gray-50 rounded mt-2 space-y-2 p-3">
                  {GENDERS.map((item) => (
                    <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.gender === item.value}
                        onChange={() => handleFilterChange('gender', item.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{item.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter - luôn hiện, nhưng disabled nếu chưa chọn mainType */}
            <div className="mb-6">
              <button
                onClick={() => toggleFilterSection('brand')}
                className={`w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 font-semibold text-left ${
                  filters.mainType ? 'bg-blue-50' : ''
                }`}
              >
                <span>Hãng</span>
                {expandedFilters.brand ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedFilters.brand && (
                <div className="bg-gray-50 rounded mt-2 space-y-2 p-3 max-h-48 overflow-y-auto">
                  {!filters.mainType ? (
                    <p className="text-sm text-gray-500">Chọn “Nhóm” trước để hiện hãng</p>
                  ) : brands.length > 0 ? (
                    brands.map((brand) => (
                      <label key={brand._id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brand === brand._id}
                          onChange={() => handleFilterChange('brand', brand._id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{brand.displayName || brand.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Không có hãng</p>
                  )}
                </div>
              )}
            </div>

            {/* Price Filter - 2-way range */}
            <div>
              <button
                onClick={() => toggleFilterSection('price')}
                className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 font-semibold text-left"
              >
                <span>Giá</span>
                {expandedFilters.price ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {expandedFilters.price && (
                <div className="bg-gray-50 rounded mt-2 p-4 space-y-4">
                  {/* Separate Min Price Slider */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-2">Giá tối thiểu</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={filters.minPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        className="flex-1 range-slider cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #B91C1C 0%, #B91C1C ${(filters.minPrice / PRICE_MAX) * 100}%, #D1D5DB ${(filters.minPrice / PRICE_MAX) * 100}%, #D1D5DB 100%)`
                        }}
                      />
                      <span className="text-sm font-semibold text-primary min-w-[50px] text-right">
                        {(filters.minPrice / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>

                  {/* Separate Max Price Slider */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-2">Giá tối đa</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={filters.maxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        className="flex-1 range-slider cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #D1D5DB 0%, #D1D5DB ${(filters.maxPrice / PRICE_MAX) * 100}%, #B91C1C ${(filters.maxPrice / PRICE_MAX) * 100}%, #B91C1C 100%)`
                        }}
                      />
                      <span className="text-sm font-semibold text-primary min-w-[50px] text-right">
                        {(filters.maxPrice / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>

                  {/* Price Range Summary */}
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-800">
                        <span className="text-primary">{(filters.minPrice / 1000).toFixed(0)}K</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="text-primary">{(filters.maxPrice / 1000).toFixed(0)}K</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Khoảng: {((filters.maxPrice - filters.minPrice) / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setFilters((p) => ({ ...p, minPrice: PRICE_MIN, maxPrice: PRICE_MAX }));
                      const params = new URLSearchParams();
                      Object.entries(filters).forEach(([key, value]) => {
                        if (key !== 'minPrice' && key !== 'maxPrice' && value && value !== '') {
                          params.set(key, value);
                        }
                      });
                      setSearchParams(params);
                    }}
                    className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-800 font-medium rounded border border-blue-300 hover:bg-blue-50 transition"
                  >
                    Đặt lại giá
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} sản phẩm
              {hasActiveFilters && ' (Đã lọc)'}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm phù hợp</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
