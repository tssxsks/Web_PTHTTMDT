import React from 'react';
import { formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';

const CartTotal = ({ includeShipping = true }) => {
  const { cartItems, products } = useShop();

  const subtotal = cartItems.reduce((total, item) => {
    const product = products.find(p => p._id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  const shipping = includeShipping && subtotal > 500000 ? 0 : 30000;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="font-bold text-lg mb-4">Tổng đơn hàng</h2>
      
      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        {includeShipping && (
          <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600">Miễn phí</span>
              ) : (
                formatCurrency(shipping)
              )}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Thuế (10%):</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-bold">Tổng cộng:</span>
        <span className="font-bold text-primary text-2xl">{formatCurrency(total)}</span>
      </div>

      {subtotal > 0 && subtotal <= 500000 && includeShipping && (
        <p className="text-sm text-green-600 mt-3">
          Mua thêm {formatCurrency(500000 - subtotal)} để được miễn phí vận chuyển
        </p>
      )}
    </div>
  );
};

export default CartTotal;
