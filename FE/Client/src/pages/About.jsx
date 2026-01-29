import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Về chúng tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Thương hiệu Shoe Store</h2>
          <p className="text-gray-600 mb-4">
            Shoe Store là một trong những cửa hàng giày dép trực tuyến uy tín nhất tại Việt Nam. Chúng tôi cung cấp các sản phẩm giày dép chất lượng cao từ các thương hiệu nổi tiếng thế giới.
          </p>
          <p className="text-gray-600 mb-4">
            Với hơn 10 năm kinh nghiệm trong ngành, Shoe Store cam kết mang đến cho khách hàng những sản phẩm tốt nhất với giá cả cạnh tranh nhất.
          </p>
          <p className="text-gray-600">
            Chúng tôi luôn lắng nghe ý kiến của khách hàng để không ngừng cải thiện dịch vụ và sản phẩm.
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-12 rounded-lg flex items-center justify-center text-9xl">
          👟
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-4xl mb-4">✓</p>
            <h3 className="font-bold text-lg mb-2">Chất lượng</h3>
            <p className="text-gray-600">Chúng tôi chỉ bán các sản phẩm có chất lượng tốt nhất</p>
          </div>
          <div className="text-center">
            <p className="text-4xl mb-4">♥</p>
            <h3 className="font-bold text-lg mb-2">Tình yêu</h3>
            <p className="text-gray-600">Chúng tôi yêu thương mỗi khách hàng của mình</p>
          </div>
          <div className="text-center">
            <p className="text-4xl mb-4">🚀</p>
            <h3 className="font-bold text-lg mb-2">Đổi mới</h3>
            <p className="text-gray-600">Luôn cập nhật các xu hướng mới trong ngành</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8">Khách hàng nói gì về chúng tôi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400">★</span>)}
            </div>
            <p className="text-gray-600 mb-4">
              Sản phẩm rất tốt, giao hàng nhanh chóng. Tôi rất hài lòng với dịch vụ của Shoe Store.
            </p>
            <p className="font-bold">Nguyễn Văn A</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
