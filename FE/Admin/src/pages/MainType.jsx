import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import * as adminApi from '../utils/adminApi';

const MainTypeManagement = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: ''
  });

  useEffect(() => {
    fetchMainTypes();
  }, []);

  const fetchMainTypes = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllMainTypes();
      setMainTypes(response.data.mainTypes || []);
    } catch (error) {
      console.error('Error fetching main types:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await adminApi.updateMainType(editingId, formData);
        alert('Cập nhật thành công');
      } else {
        await adminApi.addMainType(formData);
        alert('Thêm thành công');
      }
      
      setFormData({ name: '', displayName: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchMainTypes();
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (mainType) => {
    setFormData({
      name: mainType.name,
      displayName: mainType.displayName,
      description: mainType.description || ''
    });
    setEditingId(mainType._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
      try {
        await adminApi.deleteMainType(id);
        alert('Xóa thành công');
        fetchMainTypes();
      } catch (error) {
        console.error('Error:', error);
        alert('Lỗi: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', displayName: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Loại chính (Giày/Dép)</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={20} /> Thêm loại chính
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Chỉnh sửa loại chính' : 'Thêm loại chính mới'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên (Slug) *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: shoes, sandals"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={editingId ? true : false}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên hiển thị *
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="VD: Giày, Dép"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tên Slug</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Tên hiển thị</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Mô tả</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mainTypes.map((mainType) => (
              <tr key={mainType._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{mainType.name}</td>
                <td className="px-6 py-4 text-sm font-medium">{mainType.displayName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {mainType.description || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(mainType)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(mainType._id)}
                    className="text-red-500 hover:text-red-700 inline-flex items-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mainTypes.length === 0 && (
        <div className="text-center text-gray-500 py-8">Chưa có loại chính nào</div>
      )}
    </div>
  );
};

export default MainTypeManagement;
