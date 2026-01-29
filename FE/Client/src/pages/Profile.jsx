import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import * as userApi from '../services/userApi';

const Profile = () => {
  const { user, token, updateUserInfo } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      ward: user?.address?.ward || '',
      district: user?.address?.district || '',
      city: user?.address?.city || ''
    }
  });

  // Cập nhật form khi user thay đổi
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        ward: user?.address?.ward || '',
        district: user?.address?.district || '',
        city: user?.address?.city || ''
      }
    });
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address_')) {
      const field = name.replace('address_', '');
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.updateUserProfile(formData);
      // Cập nhật user trong context
      if (response.data.user) {
        updateUserInfo(response.data.user);
      }
      alert('Cập nhật hồ sơ thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await userApi.changePassword(passwordData.oldPassword, passwordData.newPassword);
      alert('Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Change password error:', error);
      alert('Lỗi: ' + (error.response?.data?.message || 'Có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem hồ sơ</p>
        <a href="/login" className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark inline-block">
          Đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Thông tin cá nhân
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary hover:text-primary-dark font-bold"
              >
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Họ và tên"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
                  />
                  <input
                    type="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="address_street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Đường, số nhà"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      name="address_ward"
                      value={formData.address.ward}
                      onChange={handleInputChange}
                      placeholder="Phường/Xã"
                      className="px-4 py-2 border rounded outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      name="address_district"
                      value={formData.address.district}
                      onChange={handleInputChange}
                      placeholder="Quận/Huyện"
                      className="px-4 py-2 border rounded outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      name="address_city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="Thành phố"
                      className="px-4 py-2 border rounded outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Họ và tên</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Số điện thoại</p>
                    <p className="font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-600 text-sm">Địa chỉ</p>
                    <p className="font-medium">
                      {user?.address?.street || 'Chưa cập nhật'}, {user?.address?.ward}, {user?.address?.district}, {user?.address?.city}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Đổi mật khẩu
              </h2>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-primary hover:text-primary-dark font-bold text-sm"
              >
                {isChangingPassword ? 'Hủy' : 'Đổi mật khẩu'}
              </button>
            </div>

            {isChangingPassword ? (
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Mật khẩu hiện tại"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
                    required
                  />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Mật khẩu mới"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
                    required
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Xác nhận mật khẩu"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-primary"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">Nhấn "Đổi mật khẩu" để thay đổi mật khẩu của bạn.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
