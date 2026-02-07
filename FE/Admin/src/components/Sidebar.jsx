import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, X, Tag, Layers, Zap, Image } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Sản phẩm', path: '/products', icon: Package },
    { label: 'Thêm sản phẩm', path: '/add-product', icon: Package },
    { label: 'Đơn hàng', path: '/orders', icon: ShoppingCart },
    { label: 'Loại chính', path: '/main-types', icon: Tag },
    { label: 'Loại sản phẩm', path: '/product-types', icon: Layers },
    { label: 'Hãng', path: '/brands', icon: Zap },
    { label: 'Kích cỡ', path: '/sizes', icon: Layers },
    { label: 'Banner', path: '/banners', icon: Image },
    { label: 'Thống kê', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 transition-transform md:translate-x-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8 md:mb-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={onClose} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
