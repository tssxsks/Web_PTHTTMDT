import React, { useState, useEffect } from 'react';
import * as adminApi from '../utils/adminApi';

const Add = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [sizeSelected, setSizeSelected] = useState('');
  const [stockInput, setStockInput] = useState('');

  // 1. Thêm state để lưu URL preview
  const [previewUrls, setPreviewUrls] = useState([]);

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
    images: [] // Mảng chứa File object
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 2. Cleanup memory khi component unmount hoặc previewUrls thay đổi
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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
    setFormData(prev => ({
      ...prev,
      mainType: mainTypeId,
      productType: '',
      sizes: [] 
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
      setSizes(sizeRes.data.sizes || []);
    } catch (error) {
      console.error('Error fetching product types/sizes:', error);
    }
  };

  // 3. Xử lý chọn ảnh (Nâng cấp)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Tạo preview URL cho các ảnh MỚI vừa chọn
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // Cập nhật state: NỐI THÊM vào danh sách cũ (spread operator)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files], 
    }));

    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    // Reset value input để có thể chọn lại cùng 1 file nếu lỡ xóa
    e.target.value = ''; 
  };

  // 4. Xử lý xóa ảnh khỏi danh sách chờ upload
  const removeImage = (index) => {
    // Xóa File khỏi formData
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Xóa và revoke URL preview
    setPreviewUrls((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Giải phóng bộ nhớ
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const removeSizeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

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

    if (!formData.name || !formData.price || !formData.mainType || !formData.productType || !formData.brand) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
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
      if (formData.age) data.append('age', formData.age);
      if (formData.gender) data.append('gender', formData.gender);

      const sizesPayload = formData.sizes.map(s => ({
        size: Number(s.size),
        stock: Number(s.stock)
      }));
      data.append('sizes', JSON.stringify(sizesPayload));
      data.append('bestSeller', String(formData.bestSeller));
      data.append('featured', String(formData.featured));

      // Append từng file ảnh
      formData.images.forEach((image) => {
        data.append('images', image);
      });

      await adminApi.addProduct(data);

      alert('Thêm sản phẩm thành công');

      // Reset form & Preview
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
      setPreviewUrls([]); // Reset preview
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

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Thêm sản phẩm mới</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {/* ... (Các input Text/Price/Brand giữ nguyên như cũ) ... */}
        
        {/* Tên SP */}
        <div>
          <label className="block font-bold mb-2">Tên sản phẩm *</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nhập tên sản phẩm" className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required />
        </div>

        {/* Giá & Hãng */}
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block font-bold mb-2">Giá (VND) *</label>
             <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required />
          </div>
          <div>
            <label className="block font-bold mb-2">Hãng *</label>
            <select name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required>
              <option value="">-- Chọn hãng --</option>
              {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {/* Mô tả */}
        <div>
           <label className="block font-bold mb-2">Mô tả</label>
           <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded outline-none focus:border-primary"></textarea>
        </div>

        {/* Loại & Giới tính (Giữ nguyên code của bạn) */}
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block font-bold mb-2">Loại chính *</label>
             <select name="mainType" value={formData.mainType} onChange={handleMainTypeChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required>
                <option value="">-- Chọn loại --</option>
                {mainTypes.map(m => <option key={m._id} value={m._id}>{m.displayName}</option>)}
             </select>
           </div>
           <div>
             <label className="block font-bold mb-2">Loại sản phẩm *</label>
             <select name="productType" value={formData.productType} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary" required disabled={!formData.mainType}>
                <option value="">-- Chọn loại SP --</option>
                {productTypes.map(t => <option key={t._id} value={t._id}>{t.displayName}</option>)}
             </select>
           </div>
        </div>
        
        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block font-bold mb-2">Độ tuổi</label>
             <select name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary">
               <option value="">-- Chọn --</option>
               <option value="adults">Người lớn</option>
               <option value="kids">Trẻ em</option>
             </select>
           </div>
           <div>
             <label className="block font-bold mb-2">Giới tính</label>
             <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border rounded outline-none focus:border-primary">
               <option value="">-- Chọn --</option>
               <option value="men">Nam</option>
               <option value="women">Nữ</option>
               <option value="unisex">Unisex</option>
             </select>
           </div>
        </div>

        {/* Checkbox BestSeller/Featured (Giữ nguyên) */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" name="bestSeller" checked={formData.bestSeller} onChange={handleInputChange} /> <b>Bán chạy</b></label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} /> <b>Nổi bật</b></label>
        </div>

        {/* Sizes (Giữ nguyên logic của bạn) */}
        <div>
          <label className="block font-bold mb-2">Kích cỡ & Tồn kho *</label>
          <div className="flex gap-2 mb-3">
             <select value={sizeSelected} onChange={e=>setSizeSelected(e.target.value)} className="flex-1 px-3 py-2 border rounded" disabled={!formData.mainType}>
                <option value="">-- Size --</option>
                {sizes.map(s => <option key={s._id} value={s._id}>{getSizeLabel(s)}</option>)}
             </select>
             <input type="number" value={stockInput} onChange={e=>setStockInput(e.target.value)} placeholder="Tồn kho" className="w-40 px-3 py-2 border rounded" disabled={!formData.mainType}/>
             <button type="button" onClick={addSizeItem} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={!formData.mainType}>Thêm</button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto border p-3 rounded bg-gray-50">
             {formData.sizes.map((s, i) => (
                <div key={i} className="flex justify-between text-sm border-b pb-1 last:border-0">
                   <span>Size: {s.size} | Stock: {s.stock}</span>
                   <button type="button" onClick={()=>removeSizeItem(i)} className="text-red-500 font-bold">X</button>
                </div>
             ))}
             {formData.sizes.length === 0 && <p className="text-gray-400 text-sm text-center">Chưa có kích cỡ nào</p>}
          </div>
        </div>

        {/* --- PHẦN ẢNH ĐƯỢC NÂNG CẤP TẠI ĐÂY --- */}
        <div>
          <label className="block font-bold mb-2">Hình ảnh sản phẩm *</label>
          
          <div className="mb-3">
            <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 transition">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <span>Chọn ảnh (Có thể chọn nhiều)</span>
            </label>
            <input 
              id="image-upload"
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageChange} 
              className="hidden" // Ẩn input mặc định đi cho đẹp
            />
          </div>

          {/* Grid hiển thị ảnh Preview */}
          {previewUrls.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group border rounded-lg overflow-hidden h-32 w-full shadow-sm">
                  {/* Ảnh */}
                  <img 
                    src={url} 
                    alt="preview" 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* Nút Xóa (Hiện khi hover) */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none"
                      title="Xóa ảnh này"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Chưa có ảnh nào được chọn
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 mt-6">
          {submitting ? 'Đang thêm...' : 'Thêm sản phẩm'}
        </button>
      </form>
    </div>
  );
};

export default Add;