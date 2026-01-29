import React from 'react';
import { Truck, RotateCcw, Headphones, Lock } from 'lucide-react';

const OurPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-center">
          <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-gray-800 mb-2">Giao hàng nhanh</h3>
          <p className="text-gray-600 text-sm">Giao hàng miễn phí cho đơn hàng trên 500k</p>
        </div>
        <div className="text-center">
          <RotateCcw className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-gray-800 mb-2">Đổi trả dễ dàng</h3>
          <p className="text-gray-600 text-sm">Đổi trả miễn phí trong 30 ngày</p>
        </div>
        <div className="text-center">
          <Headphones className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-gray-800 mb-2">Hỗ trợ khách hàng</h3>
          <p className="text-gray-600 text-sm">Hỗ trợ 24/7 qua điện thoại và chat</p>
        </div>
        <div className="text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-gray-800 mb-2">Thanh toán an toàn</h3>
          <p className="text-gray-600 text-sm">Thanh toán được bảo vệ bằng SSL</p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
