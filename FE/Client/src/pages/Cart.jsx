import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { cartItems, products, removeFromCart, updateCartItem } = useShop();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h1>
        <p className="text-gray-600 mb-8">Giỏ hàng của bạn đang trống</p>
        <Link to="/collection" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark inline-block">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Sản phẩm</th>
                  <th className="px-4 py-3 text-left font-bold">Size</th>
                  <th className="px-4 py-3 text-left font-bold">Giá</th>
                  <th className="px-4 py-3 text-left font-bold">Số lượng</th>
                  <th className="px-4 py-3 text-left font-bold">Tổng</th>
                  <th className="px-4 py-3 text-left font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => {
                  const product = products.find(p => p._id === item.productId);
                  if (!product) return null;

                  return (
                    <tr key={`${item.productId}-${item.size}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex gap-3">
                          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-2xl">
                            {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" /> : '👟'}
                          </div>
                          <div>
                            <p className="font-bold">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium">{item.size}</td>
                      <td className="px-4 py-4 font-medium">{formatCurrency(product.price)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartItem(item.productId, item.size, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-gray-200 rounded">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartItem(item.productId, item.size, item.quantity + 1)} className="p-1 hover:bg-gray-200 rounded">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold">{formatCurrency(product.price * item.quantity)}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => removeFromCart(item.productId, item.size)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cart Summary */}
        <div>
          <CartTotal includeShipping={true} />
          
          <Link to="/place-order" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition mt-6 block text-center">
            Tiếp tục thanh toán
          </Link>

          <Link to="/collection" className="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition mt-3 block text-center">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
