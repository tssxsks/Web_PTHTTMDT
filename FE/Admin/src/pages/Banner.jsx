import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import * as bannerApi from '../utils/bannerApi';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    imagePreview: '',
    link: '',
    description: '',
    priority: 0,
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  // Fetch banners
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerApi.getAllBanners();
      setBanners(data.banners || []);
      setError(null);
    } catch (err) {
      setError('Lỗi tải banner');
      console.error(err);
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
          setFormData({
            ...formData,
            image: file,
            imagePreview: reader.result,
          });
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validation
      if (!formData.title || !formData.link) {
        setError('Vui lòng nhập tiêu đề và đường dẫn');
        setLoading(false);
        return;
      }

      if (!editingId && !formData.image) {
        setError('Vui lòng chọn hình ảnh banner');
        setLoading(false);
        return;
      }

      if (editingId) {
        await bannerApi.updateBanner(editingId, formData);
        setSuccess('Banner cập nhật thành công');
      } else {
        await bannerApi.createBanner(formData);
        setSuccess('Banner tạo thành công');
      }
      fetchBanners();
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi xử lý banner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setFormData({
      title: banner.title,
      image: null,
      imagePreview: banner.imageUrl,
      link: banner.link,
      description: banner.description || '',
      priority: banner.priority || 0,
      isActive: banner.isActive,
      startDate: banner.startDate.split('T')[0],
      endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa banner này?')) {
      try {
        setLoading(true);
        await bannerApi.deleteBanner(id);
        setSuccess('Banner xóa thành công');
        fetchBanners();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Lỗi xóa banner');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await bannerApi.toggleBannerStatus(id);
      fetchBanners();
      setSuccess('Cập nhật trạng thái thành công');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Lỗi cập nhật trạng thái');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      image: null,
      imagePreview: '',
      link: '',
      description: '',
      priority: 0,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản Lý Banner</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          {showForm ? 'Hủy' : 'Thêm Banner'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Tiêu Đề *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề banner"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium mb-2">Đường Dẫn *</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: /collection hoặc https://example.com"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2">Độ Ưu Tiên</label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số cao hơn = hiển thị trước"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Ngày Bắt Đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Ngày Kết Thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Kích Hoạt</label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Mô Tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả banner"
                rows="3"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Hình Ảnh Banner *</label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.imagePreview && (
                <div className="mt-3">
                  <img src={formData.imagePreview} alt="Preview" className="h-40 rounded object-cover w-full" />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Đang xử lý...' : editingId ? 'Cập Nhật' : 'Tạo Banner'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && banners.length === 0 ? (
          <div className="p-6 text-center">Đang tải...</div>
        ) : banners.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Chưa có banner nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Tiêu Đề</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Hình Ảnh</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Đường Dẫn</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Độ Ưu Tiên</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Trạng Thái</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {banners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{banner.title}</div>
                      {banner.description && (
                        <div className="text-sm text-gray-500">{banner.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-12 w-24 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 truncate">{banner.link}</td>
                    <td className="px-6 py-4 text-center font-semibold">{banner.priority}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(banner._id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${banner.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Xóa"
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
        )}
      </div>
    </div>
  );
};

export default Banner;
