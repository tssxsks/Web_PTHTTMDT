import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import * as adminApi from '../utils/adminApi';

const ProductTypeManagement = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [mainTypes, setMainTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    mainType: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [typesRes, mainTypesRes] = await Promise.all([
        adminApi.getAllProductTypes(),
        adminApi.getAllMainTypes()
      ]);
      setProductTypes(typesRes.data.productTypes || []);
      setMainTypes(mainTypesRes.data.mainTypes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        await adminApi.updateProductType(editingId, formData);
        alert('Cập nhật thành công');
      } else {
        await adminApi.addProductType(formData);
        alert('Thêm thành công');
      }
      
      setFormData({ name: '', displayName: '', mainType: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (productType) => {
    setFormData({
      name: productType.name,
      displayName: productType.displayName,
      mainType: productType.mainType?._id || '',
      description: productType.description || ''
    });
    setEditingId(productType._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
      try {
        await adminApi.deleteProductType(id);
        alert('Xóa thành công');
        fetchData();
      } catch (error) {
        console.error('Error:', error);
        alert('Lỗi: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', displayName: '', mainType: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const getMainTypeName = (id) => {
    const mainType = mainTypes.find(mt => mt._id === id);
    return mainType ? mainType.displayName : '-';
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Loại sản phẩm</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus size={20} /> Thêm loại sản phẩm
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Chỉnh sửa loại sản phẩm' : 'Thêm loại sản phẩm mới'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại chính *
                </label>
                <select
                  name="mainType"
                  value={formData.mainType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên (Slug) *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: sport, casual"
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
                  placeholder="VD: Giày thể thao, Giày lười"
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
              <th className="px-6 py-3 text-left text-sm font-semibold">Loại chính</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Mô tả</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productTypes.map((productType) => (
              <tr key={productType._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{productType.name}</td>
                <td className="px-6 py-4 text-sm font-medium">{productType.displayName}</td>
                <td className="px-6 py-4 text-sm">{getMainTypeName(productType.mainType?._id)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {productType.description || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(productType)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(productType._id)}
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

      {productTypes.length === 0 && (
        <div className="text-center text-gray-500 py-8">Chưa có loại sản phẩm nào</div>
      )}
    </div>
  );
};

export default ProductTypeManagement;
