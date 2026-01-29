import React from 'react';
import { LogOut, Menu } from 'lucide-react';

const Navbar = ({ onLogout, toggleSidebar }) => {
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-xl text-primary">Shoe Store Admin</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">{admin.name}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-bold"
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
