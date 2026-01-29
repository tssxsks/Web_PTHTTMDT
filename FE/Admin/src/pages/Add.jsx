import React, { useState, useEffect } from 'react';
import * as adminApi from '../utils/adminApi';

const Add = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);

  // Size options fetch theo mainType
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Input tách riêng: chọn size (dropdown) + nhập stock
  const [sizeSelected, setSizeSelected] = useState('');
  const [stockInput, setStockInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    mainType: '',
    productType: '',
    age: '',
    gender: '',
    brand: '',
    sizes: [], // [{ size: Number, stock: Number, sizeId?: string }]
    bestSeller: false,
    featured: false,
    images: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [mainTypesRes, brandsRes] = await Promise.all([
        adminApi.getAllMainTypes(),
        adminApi.getAllBrands()
      ]);
      setMainTypes(mainTypesRes.data.mainTypes || []);
      setBrands(brandsRes.data.brands || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Lỗi tải dữ liệu: ' + (error.response?.data?.message || error.message));
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

    // reset fields phụ thuộc mainType
    setFormData(prev => ({
      ...prev,
      mainType: mainTypeId,
      productType: '',
      sizes: [] // reset size list đã chọn khi đổi mainType (đỡ sai size)
    }));

    setProductTypes([]);
    setSizes([]);
    setSizeSelected('');
    setStockInput('');

    if (!mainTypeId) return;

    try {
      const [ptRes, sizeRes] = await Promise.all([
        adminApi.getAllProductTypes(mainTypeId),
        adminApi.getAllSizes(mainTypeId)
      ]);

      setProductTypes(ptRes.data.productTypes || []);
      // API size của bạn nên trả về { sizes: [...] }
      setSizes(sizeRes.data.sizes || []);
    } catch (error) {
      console.error('Error fetching product types/sizes:', error);
      alert('Lỗi tải loại sản phẩm/kích cỡ: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      images: files
    }));
  };

  const removeSizeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  // Lấy giá trị size (36/37/...) từ object size trả về từ BE
  // Bạn chỉnh lại đúng field nếu BE của bạn khác.
  const getSizeValue = (s) => {
    // Ưu tiên các field phổ biến
    const v =
      s?.value ??
      s?.size ??
      s?.number ??
      s?.name ??
      s?.displayName;

    // Nếu displayName kiểu "Size 36" thì parse số (optional)
    const asNum = Number(v);
    if (Number.isFinite(asNum)) return asNum;

    // cố gắng parse số từ chuỗi
    if (typeof v === 'string') {
      const m = v.match(/\d+(\.\d+)?/);
      if (m) return Number(m[0]);
    }
    return null;
  };

  const getSizeLabel = (s) => {
    return s?.displayName ?? s?.name ?? s?.value ?? s?.size ?? s?.number ?? 'Size';
  };

  const addSizeItem = () => {
    if (!sizeSelected) {
      alert('Vui lòng chọn kích cỡ');
      return;
    }

    const stockNum = Number(stockInput);
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      alert('Tồn kho phải là số >= 0');
      return;
    }

    const sizeObj = sizes.find(s => s._id === sizeSelected);
    if (!sizeObj) {
      alert('Kích cỡ không hợp lệ');
      return;
    }

    const sizeValue = getSizeValue(sizeObj);
    if (!Number.isFinite(sizeValue) || sizeValue <= 0) {
      alert('Không đọc được giá trị kích cỡ (36/37/...). Kiểm tra field của Size trên BE.');
      return;
    }

    // chống trùng kích cỡ theo sizeId
    const existed = formData.sizes.some(x => x.sizeId === sizeSelected);
    if (existed) {
      alert('Kích cỡ này đã được thêm rồi');
      return;
    }

    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { sizeId: sizeSelected, size: sizeValue, stock: stockNum }]
    }));

    setSizeSelected('');
    setStockInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Theo schema Product bạn gửi: mainType, productType, brand đều required
    if (!formData.name || !formData.price || !formData.mainType || !formData.productType || !formData.brand) {
      alert('Vui lòng điền: tên, giá, loại chính, loại sản phẩm và hãng');
      return;
    }

    if (formData.sizes.length === 0) {
      alert('Vui lòng thêm ít nhất một kích cỡ');
      return;
    }

    if (formData.images.length === 0) {
      alert('Vui lòng chọn ít nhất một hình ảnh');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('mainType', formData.mainType);
      data.append('productType', formData.productType);
      data.append('brand', formData.brand);

      // Schema age: ['adults','kids'] => UI phải khớp
      if (formData.age) data.append('age', formData.age);
      if (formData.gender) data.append('gender', formData.gender);

      // Đảm bảo payload đúng schema: [{size:Number, stock:Number}]
      const sizesPayload = formData.sizes.map(s => ({
        size: Number(s.size),
        stock: Number(s.stock)
      }));
      data.append('sizes', JSON.stringify(sizesPayload));

      data.append('bestSeller', String(formData.bestSeller));
      data.append('featured', String(formData.featured));

      formData.images.forEach((image) => {
        data.append('images', image);
      });

      await adminApi.addProduct(data);

      alert('Thêm sản phẩm thành công');

      setFormData({
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

      setProductTypes([]);
      setSizes([]);
      setSizeSelected('');
      setStockInput('');
    } catch (error) {
      console.error('Add product error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Thêm sản phẩm mới</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Tên sản phẩm */}
        <div>
          <label className="block font-bold mb-2">Tên sản phẩm *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên sản phẩm"
            className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            required
          />
        </div>

        {/* Giá và Hãng */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Giá (VND) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Nhập giá"
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Hãng *</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
              required
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

        {/* Mô tả */}
        <div>
          <label className="block font-bold mb-2">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả sản phẩm"
            className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
            rows="4"
          />
        </div>

        {/* Loại chính và Loại sản phẩm */}
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
            <label className="block font-bold mb-2">Loại sản phẩm *</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
              required
              disabled={!formData.mainType}
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

        {/* Độ tuổi và Giới tính */}
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
              {/* Khớp schema: adults/kids */}
              <option value="adults">Người lớn</option>
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

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bestSeller"
              checked={formData.bestSeller}
              onChange={handleInputChange}
            />
            <span className="font-bold">Sản phẩm bán chạy</span>
          </label>

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

        {/* Kích cỡ dạng dropdown option, fetch theo mainType */}
        <div>
          <label className="block font-bold mb-2">Kích cỡ và Tồn kho *</label>

          <div className="flex gap-2 mb-3">
            <select
              value={sizeSelected}
              onChange={(e) => setSizeSelected(e.target.value)}
              className="flex-1 px-3 py-2 border rounded outline-none focus:border-primary"
              disabled={!formData.mainType}
            >
              <option value="">-- Chọn kích cỡ --</option>
              {sizes.map(s => (
                <option key={s._id} value={s._id}>
                  {getSizeLabel(s)}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Tồn kho"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              className="w-40 px-3 py-2 border rounded outline-none focus:border-primary"
              disabled={!formData.mainType}
            />

            <button
              type="button"
              onClick={addSizeItem}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={!formData.mainType}
            >
              Thêm
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto border p-3 rounded">
            {formData.sizes.length === 0 ? (
              <p className="text-gray-500">Chưa thêm kích cỡ nào</p>
            ) : (
              formData.sizes.map((s, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="text-sm">
                    <b>Size:</b> {s.size} — <b>Tồn kho:</b> {s.stock}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSizeItem(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Hình ảnh */}
        <div>
          <label className="block font-bold mb-2">Hình ảnh (có thể chọn nhiều) *</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {formData.images.length > 0 && (
            <div className="mt-2 space-y-1">
              {formData.images.map((img, idx) => (
                <p key={idx} className="text-sm text-gray-600">✓ {img.name}</p>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
        >
          {submitting ? 'Đang thêm...' : 'Thêm sản phẩm'}
        </button>
      </form>
    </div>
  );
};

export default Add;
