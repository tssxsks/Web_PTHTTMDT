import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Shoe Store</h3>
            <p className="text-sm mb-4">
              Cửa hàng giày dép trực tuyến uy tín, cung cấp các sản phẩm chất lượng cao với giá cạnh tranh.
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 hover:text-primary cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-primary cursor-pointer" />
              <Instagram className="w-5 h-5 hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Liên kết nhanh</h4>
            <ul className="text-sm space-y-2">
              <li><Link to="/" className="hover:text-primary">Trang chủ</Link></li>
              <li><Link to="/collection" className="hover:text-primary">Sản phẩm</Link></li>
              <li><Link to="/about" className="hover:text-primary">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Thông tin liên hệ</h4>
            <div className="text-sm space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@shoestore.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Đường ABC, TP. HCM</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4">Đăng ký nhận tin</h4>
            <p className="text-sm mb-3">Nhận thông tin về các sản phẩm mới và khuyến mãi</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-l outline-none"
              />
              <button className="px-3 py-2 bg-primary text-white text-sm rounded-r hover:bg-primary-dark">
                Gửi
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-center md:text-left">
          <p>&copy; 2024 Shoe Store. All rights reserved.</p>
          <div className="space-x-4">
            <Link to="#" className="hover:text-primary">Chính sách bảo mật</Link>
            <Link to="#" className="hover:text-primary">Điều khoản sử dụng</Link>
          </div>
          <p className="text-right hidden md:block">Thanh toán an toàn 🔒</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
