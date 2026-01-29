import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as adminApi from '../utils/adminApi';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainTypes, setMainTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    mainType: '',
    productType: '',
    age: '',
    gender: '',
    brand: '',
    sizes: [],
    bestSeller: false,
    featured: false,
    images: []
  });

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [productRes, mainTypesRes, brandsRes] = await Promise.all([
        adminApi.getProductById(id),
        adminApi.getAllMainTypes(),
        adminApi.getAllBrands()
      ]);

      const product = productRes.data.product || productRes.data.data || productRes.data;
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        mainType: product.mainType?._id || '',
        productType: product.productType?._id || '',
        age: product.age || '',
        gender: product.gender || '',
        brand: product.brand?._id || '',
        sizes: product.sizes || [],
        bestSeller: product.bestSeller || false,
        featured: product.featured || false,
        images: []
      });

      setMainTypes(mainTypesRes.data.mainTypes || []);
      setBrands(brandsRes.data.brands || []);

      // Fetch product types for selected main type
      if (product.mainType?._id) {
        const typesRes = await adminApi.getAllProductTypes(product.mainType._id);
        setProductTypes(typesRes.data.productTypes || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMainTypeChange = async (e) => {
    const mainTypeId = e.target.value;
    setFormData(prev => ({
      ...prev,
      mainType: mainTypeId,
      productType: ''
    }));

    if (mainTypeId) {
      try {
        const res = await adminApi.getAllProductTypes(mainTypeId);
        setProductTypes(res.data.productTypes || []);
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'stock' ? parseInt(value) : value
    };
    setFormData(prev => ({
      ...prev,
      sizes: newSizes
    }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: 0 }]
    }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: files
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('mainType', formData.mainType);
      if (formData.productType) data.append('productType', formData.productType);
      if (formData.age) data.append('age', formData.age);
      if (formData.gender) data.append('gender', formData.gender);
      if (formData.brand) data.append('brand', formData.brand);
      data.append('sizes', JSON.stringify(formData.sizes));
      data.append('bestSeller', formData.bestSeller);
      data.append('featured', formData.featured);

      // Append images only if new images are selected
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          data.append('images', image);
        });
      }

      await adminApi.updateProduct(id, data);
      alert('Cập nhật sản phẩm thành công');
      navigate('/products');
    } catch (error) {
      console.error('Update product error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Chỉnh sửa sản phẩm</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block font-bold mb-2">Tên sản phẩm *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Giá (VND) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Hãng</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            >
              <option value="">-- Chọn hãng --</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Loại chính *</label>
            <select
              name="mainType"
              value={formData.mainType}
              onChange={handleMainTypeChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
              required
            >
              <option value="">-- Chọn loại chính --</option>
              {mainTypes.map(mainType => (
                <option key={mainType._id} value={mainType._id}>
                  {mainType.displayName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2">Loại sản phẩm</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            >
              <option value="">-- Chọn loại sản phẩm --</option>
              {productTypes.map(type => (
                <option key={type._id} value={type._id}>
                  {type.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Dành cho (Độ tuổi)</label>
            <select
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            >
              <option value="">-- Chọn độ tuổi --</option>
              <option value="adult">Người lớn</option>
              <option value="kids">Trẻ em</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2">Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="men">Nam</option>
              <option value="women">Nữ</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleInputChange}
              />
              <span className="font-bold">Sản phẩm bán chạy</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <span className="font-bold">Sản phẩm nổi bật</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2">Kích cỡ và Tồn kho *</label>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {formData.sizes.map((sizeObj, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kích cỡ (VD: 35, 36, 37...)"
                  value={sizeObj.size || ''}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  className="flex-1 px-4 py-2 border rounded outline-none focus:border-primary"
                />
                <input
                  type="number"
                  placeholder="Tồn kho"
                  value={sizeObj.stock || 0}
                  onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                  className="w-24 px-4 py-2 border rounded outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSize}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Thêm kích cỡ
          </button>
        </div>

        <div>
          <label className="block font-bold mb-2">Hình ảnh (để trống nếu không cần thay đổi)</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded"
            accept="image/*"
          />
          <p className="text-sm text-gray-600 mt-1">Chọn tệp hình ảnh để thay thế</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600"
          >
            Cập nhật sản phẩm
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex-1 bg-gray-400 text-white font-bold py-2 rounded hover:bg-gray-500"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
