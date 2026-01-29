import React, { useEffect, useState } from 'react';
import { BarChart3, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import * as adminApi from '../utils/adminApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          adminApi.getAllOrders(),
          adminApi.getProducts()
        ]);

        const orders = ordersRes.data.orders || ordersRes.data.data || [];
        const products = productsRes.data.products || productsRes.data.data || [];

        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.amount || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'PENDING').length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          pendingOrders
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Tổng đơn hàng"
          value={stats.totalOrders}
          color="bg-blue-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Doanh thu"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          color="bg-green-500"
        />
        <StatCard
          icon={Package}
          label="Sản phẩm"
          value={stats.totalProducts}
          color="bg-purple-500"
        />
        <StatCard
          icon={BarChart3}
          label="Đơn chờ xác nhận"
          value={stats.pendingOrders}
          color="bg-red-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Thông tin nhanh</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span>Tỷ lệ hoàn thành đơn hàng</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
            <span className="text-sm">75%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
