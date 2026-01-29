import React, { useState } from 'react';
import { Send } from 'lucide-react';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
      <div className="max-w-md mx-auto text-center px-4">
        <h2 className="font-display text-2xl font-bold mb-2">Nhận khuyến mãi độc quyền</h2>
        <p className="mb-6 text-gray-200">Đăng ký để nhận thông tin về các sản phẩm mới và khuyến mãi đặc biệt</p>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-800 rounded outline-none"
            required
          />
          <button type="submit" className="bg-white text-primary px-4 py-3 rounded font-bold hover:bg-gray-100 transition flex items-center gap-2">
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        {submitted && (
          <p className="mt-4 text-green-200">✓ Cảm ơn bạn đã đăng ký!</p>
        )}
      </div>
    </div>
  );
};

export default NewsletterBox;
