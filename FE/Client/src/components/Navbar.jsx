import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, cartItems, token } = useShop();

  // Debug logging
  React.useEffect(() => {
    console.log('Navbar - token:', token);
    console.log('Navbar - user:', user);
  }, [token, user]);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">👟</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg">Shoe Store</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium">Trang chủ</Link>
            <Link to="/collection" className="text-gray-700 hover:text-primary font-medium">Sản phẩm</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium">Về chúng tôi</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium">Liên hệ</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {token ? (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-700" />
                  <span className="hidden sm:inline text-sm text-gray-700">{user?.name}</span>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-gray-700 hover:text-primary transition"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Đơn hàng
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary font-medium">
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary">Trang chủ</Link>
            <Link to="/collection" className="block py-2 text-gray-700 hover:text-primary">Sản phẩm</Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-primary">Về chúng tôi</Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-primary">Liên hệ</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
