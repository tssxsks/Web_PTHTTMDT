import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ liên hệ lại sớm!');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Liên hệ với chúng tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Điện thoại</h3>
          <p className="text-gray-600">0123 456 789</p>
          <p className="text-gray-600">Thứ 2 - Chủ nhật: 8h - 22h</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Email</h3>
          <p className="text-gray-600">info@shoestore.com</p>
          <p className="text-gray-600">support@shoestore.com</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 text-center">
          <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Địa chỉ</h3>
          <p className="text-gray-600">123 Đường ABC</p>
          <p className="text-gray-600">TP. Hồ Chí Minh, Việt Nam</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Họ và tên"
              className="px-4 py-2 border rounded outline-none focus:border-primary"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="px-4 py-2 border rounded outline-none focus:border-primary"
              required
            />
          </div>

          <input
            type="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
            className="w-full px-4 py-2 border rounded outline-none focus:border-primary mb-4"
          />

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Tiêu đề"
            className="w-full px-4 py-2 border rounded outline-none focus:border-primary mb-4"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Nội dung tin nhắn"
            rows="6"
            className="w-full px-4 py-2 border rounded outline-none focus:border-primary mb-4"
            required
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition"
          >
            Gửi tin nhắn
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
