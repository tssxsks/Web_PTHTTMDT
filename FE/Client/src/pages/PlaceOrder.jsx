import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { useShop } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import * as orderApi from '../services/orderApi';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, products, user, token } = useShop();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    ward: user?.address?.ward || '',
    district: user?.address?.district || '',
    city: user?.address?.city || '',
    country: 'Việt Nam'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      items: cartItems,
      amount: getTotalPrice(),
      address: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        ward: formData.ward,
        district: formData.district,
        city: formData.city,
        country: formData.country
      },
      paymentMethod
    };

    try {
      let response;
      
      switch (paymentMethod) {
        case 'COD':
          response = await orderApi.placeOrder(orderData);
          alert('Đặt hàng thành công! Vui lòng chờ xác nhận');
          navigate('/orders');
          break;
        case 'STRIPE':
          response = await orderApi.placeOrderStripe(orderData);
          window.location.href = response.data.url;
          break;
        case 'RAZORPAY':
          response = await orderApi.placeOrderRazorpay(orderData);
          // Handle Razorpay
          break;
        case 'VNPAY':
          response = await orderApi.placeOrderVnpay(orderData);
          window.location.href = response.data.url;
          break;
        case 'MOMO':
          response = await orderApi.placeOrderMomo(orderData);
          window.location.href = response.data.url;
          break;
        case 'SOLANA':
          response = await orderApi.placeOrderSolana(orderData);
          // Handle Solana payment
          break;
      }
    } catch (error) {
      alert('Lỗi: ' + error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p._id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để tiếp tục</p>
        <a href="/login" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark inline-block">
          Đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery & Payment Info */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder}>
            {/* Delivery Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Địa chỉ giao hàng
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Họ"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded outline-none focus:border-primary"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Tên"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded outline-none focus:border-primary"
                  required
                />
                <input
                  type="phone"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded outline-none focus:border-primary"
                  required
                />
              </div>

              <input
                type="text"
                name="street"
                placeholder="Địa chỉ (đường, số nhà)"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded outline-none focus:border-primary mb-4"
                required
              />

              <div className="grid grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  name="ward"
                  placeholder="Phường/Xã"
                  value={formData.ward}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded outline-none focus:border-primary"
                />
                <input
                  type="text"
                  name="district"
                  placeholder="Quận/Huyện"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded outline-none focus:border-primary"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Thành phố"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {[
                  { value: 'COD', label: 'Thanh toán khi nhận hàng' },
                  { value: 'STRIPE', label: 'Thẻ tín dụng (Stripe)' },
                  { value: 'VNPAY', label: 'VNPay' },
                  { value: 'MOMO', label: 'Momo' },
                  { value: 'RAZORPAY', label: 'Razorpay' },
                  { value: 'SOLANA', label: 'Solana' }
                ].map(method => (
                  <label key={method.value} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition mt-6 disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <CartTotal includeShipping={true} />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
