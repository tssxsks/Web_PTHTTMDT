import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as adminApi from '../utils/adminApi';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data dropdowns
  const [mainTypes, setMainTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]); // List sizes options để chọn

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State cho phần thêm Size
  const [sizeSelected, setSizeSelected] = useState('');
  const [stockInput, setStockInput] = useState('');

  // State quản lý ảnh
  const [oldImages, setOldImages] = useState([]); // Ảnh cũ từ DB
  const [previewUrls, setPreviewUrls] = useState([]); // Ảnh mới chọn để review

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
    images: [] // Chứa File objects mới
  });

  useEffect(() => {
    fetchAllData();
  }, [id]);

  // Cleanup bộ nhớ preview khi unmount hoặc đổi ảnh
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Lấy data sản phẩm và các danh mục
      const [productRes, mainTypesRes, brandsRes] = await Promise.all([
        adminApi.getProductById(id),
        adminApi.getAllMainTypes(),
        adminApi.getAllBrands()
      ]);

      const product = productRes.data.product || productRes.data.data || productRes.data;
      
      // Set dữ liệu vào form
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
        images: [] // Reset mảng file mới
      });

      // Lưu ảnh cũ để hiển thị
      setOldImages(product.images || []);

      setMainTypes(mainTypesRes.data.mainTypes || []);
      setBrands(brandsRes.data.brands || []);

      // Fetch product types và sizes options cho mainType hiện tại
      if (product.mainType?._id) {
        const [typesRes, sizesRes] = await Promise.all([
             adminApi.getAllProductTypes(product.mainType._id),
             adminApi.getAllSizes(product.mainType._id) // Giả sử bạn có API này
        ]);
        setProductTypes(typesRes.data.productTypes || []);
        setSizes(sizesRes.data.sizes || []);
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
      productType: '',
      sizes: [] // Reset sizes đã chọn nếu đổi mainType (để tránh sai lệch)
    }));
    
    // Reset options
    setProductTypes([]);
    setSizes([]);

    if (mainTypeId) {
      try {
        const [typesRes, sizesRes] = await Promise.all([
             adminApi.getAllProductTypes(mainTypeId),
             adminApi.getAllSizes(mainTypeId)
        ]);
        setProductTypes(typesRes.data.productTypes || []);
        setSizes(sizesRes.data.sizes || []);
      } catch (error) {
        console.error('Error fetching dependent data:', error);
      }
    }
  };

  // --- XỬ LÝ ẢNH (GIỐNG ADD.JSX) ---

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Tạo preview cho ảnh mới
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // Cập nhật state: Nối thêm ảnh mới vào danh sách chờ upload
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files], 
    }));

    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    e.target.value = ''; 
  };

  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setPreviewUrls((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); 
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  // --- XỬ LÝ SIZE (GIỐNG ADD.JSX) ---
  
  const getSizeLabel = (s) => s?.displayName ?? s?.name ?? s?.value ?? s?.size ?? s?.number ?? 'Size';

  const getSizeValue = (s) => {
    const v = s?.value ?? s?.size ?? s?.number ?? s?.name ?? s?.displayName;
    const asNum = Number(v);
    if (Number.isFinite(asNum)) return asNum;
    if (typeof v === 'string') {
        const m = v.match(/\d+(\.\d+)?/);
        if (m) return Number(m[0]);
    }
    return null;
  };

  const addSizeItem = () => {
    if (!sizeSelected) { alert('Vui lòng chọn kích cỡ'); return; }
    const stockNum = Number(stockInput);
    if (!Number.isFinite(stockNum) || stockNum < 0) { alert('Tồn kho phải >= 0'); return; }
    
    const sizeObj = sizes.find(s => s._id === sizeSelected);
    if (!sizeObj) return;

    // Check trùng trong list hiện tại
    const isExist = formData.sizes.some(s => s.size === getSizeValue(sizeObj));
    if(isExist) { alert('Size này đã có trong danh sách'); return; }

    setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size: getSizeValue(sizeObj), stock: stockNum }]
    }));
    setSizeSelected('');
    setStockInput('');
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('mainType', formData.mainType);
      
      // Handle null/undefined values
      if (formData.productType) data.append('productType', formData.productType);
      if (formData.age) data.append('age', formData.age);
      if (formData.gender) data.append('gender', formData.gender);
      if (formData.brand) data.append('brand', formData.brand);
      
      // Sizes logic
      const sizesPayload = formData.sizes.map(s => ({
        size: Number(s.size),
        stock: Number(s.stock)
      }));
      data.append('sizes', JSON.stringify(sizesPayload));
      
      data.append('bestSeller', formData.bestSeller);
      data.append('featured', formData.featured);

      // Chỉ gửi images nếu có ảnh mới
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          data.append('images', image);
        });
      }

      await adminApi.updateProduct(id, data);
      alert('Cập nhật sản phẩm thành công');
      navigate('/list'); // Hoặc trang danh sách của bạn
    } catch (error) {
      console.error('Update product error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Chỉnh sửa sản phẩm</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* Tên SP */}
        <div>
          <label className="block font-bold mb-2">Tên sản phẩm *</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required />
        </div>

        {/* Giá & Hãng */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Giá (VND) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block font-bold mb-2">Hãng</label>
            <select name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary">
              <option value="">-- Chọn hãng --</option>
              {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block font-bold mb-2">Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" rows="4" />
        </div>

        {/* Loại Chính & Loại SP */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Loại chính *</label>
            <select name="mainType" value={formData.mainType} onChange={handleMainTypeChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required>
              <option value="">-- Chọn loại chính --</option>
              {mainTypes.map(m => <option key={m._id} value={m._id}>{m.displayName}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2">Loại sản phẩm</label>
            <select name="productType" value={formData.productType} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary">
              <option value="">-- Chọn loại sản phẩm --</option>
              {productTypes.map(t => <option key={t._id} value={t._id}>{t.displayName}</option>)}
            </select>
          </div>
        </div>

        {/* Tuổi & Giới tính */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2">Dành cho</label>
            <select name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary">
              <option value="">-- Chọn độ tuổi --</option>
              <option value="adults">Người lớn</option>
              <option value="kids">Trẻ em</option>
            </select>
          </div>
          <div>
            <label className="block font-bold mb-2">Giới tính</label>
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary">
              <option value="">-- Chọn giới tính --</option>
              <option value="men">Nam</option>
              <option value="women">Nữ</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Checkbox */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="bestSeller" checked={formData.bestSeller} onChange={handleInputChange} />
            <span className="font-bold">Sản phẩm bán chạy</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
            <span className="font-bold">Sản phẩm nổi bật</span>
          </label>
        </div>

        {/* Sizes Manager */}
        <div>
          <label className="block font-bold mb-2">Kích cỡ và Tồn kho *</label>
          <div className="flex gap-2 mb-3">
             <select value={sizeSelected} onChange={e=>setSizeSelected(e.target.value)} className="flex-1 px-3 py-2 border rounded" disabled={!formData.mainType}>
                <option value="">-- Chọn size --</option>
                {sizes.map(s => <option key={s._id} value={s._id}>{getSizeLabel(s)}</option>)}
             </select>
             <input type="number" value={stockInput} onChange={e=>setStockInput(e.target.value)} placeholder="Tồn kho" className="w-32 px-3 py-2 border rounded" />
             <button type="button" onClick={addSizeItem} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Thêm</button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto border p-3 rounded bg-gray-50">
            {formData.sizes.length === 0 ? <p className="text-gray-400 text-sm">Chưa có size nào</p> : 
                formData.sizes.map((s, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-2 border rounded">
                    <span>Size: <b>{s.size}</b> — Stock: <b>{s.stock}</b></span>
                    <button type="button" onClick={() => removeSize(index)} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded">Xóa</button>
                </div>
                ))
            }
          </div>
        </div>

        {/* IMAGE SECTION - QUAN TRỌNG */}
        <div>
          <label className="block font-bold mb-2">Hình ảnh sản phẩm</label>
          
          <div className="mb-4">
            <label htmlFor="image-edit-upload" className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 transition">
               <span>📷 Chọn ảnh mới (Sẽ thay thế ảnh cũ)</span>
            </label>
            <input id="image-edit-upload" type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          {/* TRƯỜNG HỢP 1: Có ảnh MỚI -> Hiển thị Preview ảnh mới (Ẩn ảnh cũ) */}
          {previewUrls.length > 0 && (
            <div>
                <p className="text-sm text-green-600 font-semibold mb-2">Ảnh mới sẽ được cập nhật:</p>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden h-24 w-full">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(index)} className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold transition">Xóa</button>
                    </div>
                ))}
                </div>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: KHÔNG có ảnh mới -> Hiển thị ảnh CŨ từ DB */}
          {previewUrls.length === 0 && oldImages.length > 0 && (
            <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">Ảnh hiện tại:</p>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-4 opacity-100">
                {oldImages.map((img, index) => (
                    <div key={index} className="relative border rounded-lg overflow-hidden h-24 w-full">
                    <img src={img.url} alt="old" className="w-full h-full object-cover" />
                    </div>
                ))}
                </div>
            </div>
          )}
          
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t mt-4">
          <button type="submit" disabled={submitting} className="flex-1 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 disabled:opacity-50">
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button type="button" onClick={() => navigate('/list')} className="flex-1 bg-gray-500 text-white font-bold py-3 rounded hover:bg-gray-600">
            Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;