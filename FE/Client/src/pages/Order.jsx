import React, { useEffect, useState } from 'react';
import { formatDate, formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';
import { ORDER_STATUS_COLORS } from '../utils/constants';
import * as orderApi from '../services/orderApi';

const Order = () => {
  const { token } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        const response = await orderApi.getUserOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
        <a href="/login" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark inline-block">
          Đăng nhập
        </a>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-20">Đang tải...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Đơn hàng của bạn</h1>
        <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lịch sử đơn hàng</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm">Mã đơn hàng</p>
                <p className="font-bold text-lg">{order._id}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-medium ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-gray-600 text-sm">Ngày đặt</p>
                <p className="font-medium">{formatDate(order.date)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng tiền</p>
                <p className="font-medium text-primary">{formatCurrency(order.amount)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Số sản phẩm</p>
                <p className="font-medium">{order.items.length} sản phẩm</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phương thức thanh toán</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-600 text-sm mb-2">Địa chỉ giao hàng</p>
              <p className="text-sm">
                {order.address.firstName} {order.address.lastName}, {order.address.phone}
                <br />
                {order.address.street}, {order.address.ward}, {order.address.district}, {order.address.city}
              </p>
            </div>

            <div className="mt-4">
              <a href={`/order/${order._id}`} className="text-primary hover:text-primary-dark font-bold">
                Xem chi tiết →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
