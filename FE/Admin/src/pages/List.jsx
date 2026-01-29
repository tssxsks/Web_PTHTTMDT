import React, { useEffect, useMemo, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import * as adminApi from '../utils/adminApi';

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getProducts();
      setProducts(response.data.products || response.data.data || []);
      setSelectedIds(new Set()); // reset selection sau khi reload
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSizesStock = (sizes) => {
    if (!Array.isArray(sizes) || sizes.length === 0) return '-';
    // sizes: [{size:Number, stock:Number}]
    return sizes
      .map(s => {
        const size = s?.size ?? s?.value ?? s?.name;
        const stock = s?.stock ?? s?.quantity;
        if (size == null) return null;
        return `Cỡ:${size} - Tồn:${stock ?? 0}`;
      })
      .filter(Boolean)
      .join('\n');
  };

  const categoryText = (p) => {
    // tuỳ BE populate, ưu tiên displayName
    const main = p?.mainType?.displayName || p?.mainType?.name;
    const sub = p?.productType?.displayName || p?.productType?.name;
    if (main && sub) return `${main} / ${sub}`;
    return main || sub || p?.category || '-';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await adminApi.deleteProduct(id);
      alert('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  const allIds = useMemo(() => products.map(p => p._id).filter(Boolean), [products]);
  const isAllSelected = allIds.length > 0 && selectedIds.size === allIds.length;

  const toggleSelectAll = () => {
    setSelectedIds(prev => {
      if (isAllSelected) return new Set();
      return new Set(allIds);
    });
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      alert('Bạn chưa chọn sản phẩm nào');
      return;
    }
    if (!window.confirm(`Xóa ${selectedIds.size} sản phẩm đã chọn?`)) return;

    try {
      const ids = Array.from(selectedIds);

      // Xóa song song. Nếu BE có rate limit mạnh, đổi sang for..of await từng cái.
      const results = await Promise.allSettled(ids.map(id => adminApi.deleteProduct(id)));

      const ok = results.filter(r => r.status === 'fulfilled').length;
      const fail = results.length - ok;

      alert(`Đã xóa: ${ok}${fail ? `, thất bại: ${fail}` : ''}`);
      fetchProducts();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
        <div className="flex gap-2">
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={selectedIds.size === 0}
            title="Xóa các sản phẩm đã chọn"
          >
            Xóa đã chọn ({selectedIds.size})
          </button>
          <a
            href="/add-product"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            + Thêm sản phẩm
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-bold w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left font-bold">Tên sản phẩm</th>
              <th className="px-6 py-3 text-left font-bold">Danh mục</th>
              <th className="px-6 py-3 text-left font-bold">Giá</th>
              <th className="px-6 py-3 text-left font-bold">Kích cỡ - Tồn kho</th>
              <th className="px-6 py-3 text-left font-bold">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product._id)}
                    onChange={() => toggleSelectOne(product._id)}
                  />
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{categoryText(product)}</td>
                <td className="px-6 py-4 text-primary font-bold">
                  {Number(product.price).toLocaleString('vi-VN')} đ
                </td>
                <td className="px-6 py-4 whitespace-pre-line text-sm">
                  {formatSizesStock(product.sizes)}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <a
                    href={`/edit-product/${product._id}`}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    <Edit className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-500 py-8">Chưa có sản phẩm nào</div>
      )}
    </div>
  );
};

export default List;
