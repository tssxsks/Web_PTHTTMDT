import React, { useEffect, useState } from 'react';
import * as adminApi from '../utils/adminApi';
import { formatCurrency, formatDateTime } from '../utils/format';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminApi.getAllOrders();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const oldOrders = orders;
    const newOrders = orders.map(order => {
      if (order._id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(newOrders);

    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
    } catch (error) {
      setOrders(oldOrders);
      alert('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Mã đơn</th>
              <th className="px-6 py-3 text-left font-bold">Khách hàng</th>
              <th className="px-6 py-3 text-left font-bold">Tổng tiền</th>
              <th className="px-6 py-3 text-left font-bold">Ngày đặt</th>
              <th className="px-6 py-3 text-left font-bold">Trạng thái</th>
              <th className="px-6 py-3 text-left font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{order._id.slice(-8)}</td>
                <td className="px-6 py-4">{order.address.firstName} {order.address.lastName}</td>
                <td className="px-6 py-4 text-primary font-bold">{formatCurrency(order.amount)}</td>
                <td className="px-6 py-4 text-sm">{formatDateTime(order.date)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã gửi</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <a href={`#order/${order._id}`} className="text-primary hover:text-primary-dark font-bold text-sm">
                    Chi tiết
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
