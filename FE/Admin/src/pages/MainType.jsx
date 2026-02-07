import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, X, Eye, EyeOff, ImageIcon } from 'lucide-react';
import * as adminApi from '../utils/adminApi';

const MainTypeManagement = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    priority: 0,
    isActive: true,
    image: null,
    imagePreview: '',
  });

  useEffect(() => {
    fetchMainTypes();
  }, []);

  const fetchMainTypes = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllMainTypes();
      setMainTypes(response.data.mainTypes || []);
      setError(null);
    } catch (error) {
      setError('Lỗi tải danh sách loại chính');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      // Gọi API toggle (Đảm bảo backend có endpoint này hoặc dùng update)
      await adminApi.toggleMainTypeStatus(id);
      
      // Cập nhật UI ngay lập tức
      setMainTypes(prev => prev.map(mt => 
        mt._id === id ? { ...mt, isActive: !mt.isActive } : mt
      ));
      
      setSuccess('Cập nhật trạng thái thành công');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Lỗi cập nhật trạng thái');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('displayName', formData.displayName);
      fd.append('description', formData.description);
      fd.append('priority', formData.priority);
      fd.append('isActive', formData.isActive);

      if (formData.image) {
        fd.append('image', formData.image);
      }

      if (editingId) {
        await adminApi.updateMainType(editingId, fd);
        setSuccess('Cập nhật thành công');
      } else {
        await adminApi.addMainType(fd);
        setSuccess('Thêm mới thành công');
      }

      resetForm();
      fetchMainTypes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi xử lý dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mt) => {
    setEditingId(mt._id);
    setFormData({
      name: mt.name,
      displayName: mt.displayName,
      description: mt.description || '',
      priority: mt.priority || 0,
      isActive: mt.isActive,
      image: null,
      imagePreview: mt.imageUrl,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa loại chính này?')) return;
    try {
      await adminApi.deleteMainType(id);
      setSuccess('Xóa thành công');
      fetchMainTypes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Lỗi khi xóa');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      priority: 0,
      isActive: true,
      image: null,
      imagePreview: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quản Lý Danh Mục</h1>
          <p className="text-gray-500 mt-1">Thiết lập các loại sản phẩm chính trên website của bạn</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
            showForm 
            ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
          }`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Hủy Bỏ' : 'Thêm Danh Mục Mới'}
        </button>
      </div>

      {/* Status Messages */}
      <div className="space-y-3 mb-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="font-medium text-sm">{success}</span>
          </div>
        )}
      </div>

      {/* Editor Form */}
      {showForm && (
        <div className="mb-10 bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-blue-600 rounded-full" />
            {editingId ? 'Chỉnh Sửa Thông Tin' : 'Tạo Mới Danh Mục'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: General Info */}
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Slug (URL Định Danh) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!!editingId}
                    required
                    placeholder="vd: giay-sneaker"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all disabled:opacity-60"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Tên Hiển Thị *
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    required
                    placeholder="vd: Giày Sneakers"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Thứ Tự Ưu Tiên</label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600 transition-all"
                      />
                      <span className="text-sm font-bold text-gray-600">Kích hoạt ngay</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Side: Media & Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh Đại Diện</label>
                  <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-6 transition-all hover:border-blue-400 hover:bg-blue-50/30 text-center">
                    <div className="flex flex-col items-center gap-3">
                      {formData.imagePreview ? (
                        <div className="relative group/img overflow-hidden rounded-xl">
                          <img 
                            src={formData.imagePreview} 
                            alt="Preview" 
                            className="h-32 w-48 object-cover shadow-sm transition-transform duration-500 group-hover/img:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="text-white" size={24} />
                          </div>
                        </div>
                      ) : (
                        <div className="h-32 w-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2">
                          <ImageIcon size={32} strokeWidth={1.5} />
                          <span className="text-xs font-medium italic">Chưa có ảnh</span>
                        </div>
                      )}
                      <div className="flex flex-col items-center">
                        <label className="cursor-pointer bg-white px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                          Chọn ảnh từ máy
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-gray-400 mt-2">Định dạng JPG, PNG. Tối đa 2MB.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mô Tả Danh Mục</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Nhập giới thiệu ngắn gọn..."
                  />
                </div>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 transition-all shadow-lg shadow-blue-200"
              >
                {loading ? 'Đang Xử Lý...' : editingId ? 'Lưu Thay Đổi' : 'Xác Nhận Tạo Danh Mục'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Danh mục</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Định danh (Slug)</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Ưu tiên</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mainTypes.map(mt => (
                <tr key={mt._id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {mt.imageUrl ? (
                        <img src={mt.imageUrl} alt="" className="w-14 h-14 object-cover rounded-xl border border-white shadow-sm ring-1 ring-gray-100" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 border border-dashed"><ImageIcon size={18}/></div>
                      )}
                      <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{mt.displayName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-xs font-mono border border-gray-100">/{mt.name}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">{mt.priority}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(mt._id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                        mt.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title="Nhấn để đổi trạng thái"
                    >
                      {mt.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      {mt.isActive ? 'Công khai' : 'Ẩn'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleEdit(mt)}
                        className="p-2.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all"
                        title="Sửa nội dung"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(mt._id)}
                        className="p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                        title="Xóa danh mục"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {mainTypes.length === 0 && !loading && (
          <div className="py-24 text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <ImageIcon className="text-gray-300" size={32} />
            </div>
            <h3 className="text-gray-900 font-bold">Chưa có danh mục nào</h3>
            <p className="text-gray-500 text-sm mb-6">Hãy bắt đầu bằng cách thêm danh mục đầu tiên của bạn.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
            >
              <Plus size={18} /> Thêm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainTypeManagement;