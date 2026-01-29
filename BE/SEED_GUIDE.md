# 🌱 Database Seeding Guide

## Tổng Quan

File `seed.js` được sử dụng để tự động thêm dữ liệu vào MongoDB, bao gồm:
- **2 User**: 1 khách hàng thường và 1 admin
- **15 Products**: Các loại giày dép từ các thương hiệu khác nhau

## Chuẩn Bị

### 1. Cài đặt Dependencies
```bash
cd BE
npm install
```

### 2. Cấu hình MongoDB
Đảm bảo `MONGO_URI` trong `.env` đã cấu hình đúng:
```env
MONGO_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/Shoe_Store?retryWrites=true&w=majority
```

### 3. Cấu hình JWT Secret
Thay đổi `JWT_SECRET` trong `.env`:
```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

## Chạy Seed

### Cách 1: Dùng npm script (Khuyến nghị)
```bash
npm run seed
```

### Cách 2: Chạy trực tiếp với Node
```bash
node seed.js
```

## Dữ Liệu Được Tạo

### 👥 Users

#### 1. Khách Hàng Thường
```
Email: user@example.com
Password: user123
Tên: Nguyễn Văn A
SĐT: 0912345678
```

#### 2. Admin
```
Email: admin@example.com
Password: admin123
Tên: Admin User
SĐT: 0987654321
```

### 👟 Products (15 sản phẩm)

#### Nam (6 sản phẩm)
1. **Nike Air Max 90** - 2.5M VND (Bán chạy)
2. **Adidas Ultraboost 22** - 3M VND (Bán chạy)
3. **Puma RS-X Softcase** - 1.8M VND
4. **New Balance 574** - 1.6M VND
5. **Converse Chuck Taylor** - 1.2M VND (Bán chạy)
6. **Timberland Classic Boots** - 4.5M VND

#### Nữ (5 sản phẩm)
7. **Nike Air Force 1 Women** - 2.2M VND (Bán chạy)
8. **Adidas Gazelle Women** - 1.9M VND
9. **Skechers Arch Fit Women** - 1.5M VND
10. **Steve Madden Heels** - 2.8M VND (Bán chạy)
11. **Birkenstock Sandals Women** - 1.6M VND

#### Trẻ Em (4 sản phẩm)
12. **Nike Revolution Kids** - 0.8M VND (Bán chạy)
13. **Adidas Stan Smith Kids** - 0.9M VND
14. **Crocs Kids** - 0.6M VND
15. **Puma Suede Kids** - 0.85M VND

## Xác Minh Dữ Liệu

### Cách 1: Dùng MongoDB Compass
1. Kết nối đến cluster MongoDB
2. Chọn database `Shoe_Store`
3. Xem collections: `users`, `products`

### Cách 2: Dùng MongoDB Atlas Web
1. Truy cập MongoDB Atlas Dashboard
2. Nhấp "Database" → "Collections"
3. Kiểm tra dữ liệu

### Cách 3: Test API
```bash
# Đăng nhập user
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'

# Đăng nhập admin
curl -X POST http://localhost:4000/api/user/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Lấy danh sách sản phẩm
curl http://localhost:4000/api/product
```

## Thay Đổi Dữ Liệu Seed

### Chỉnh sửa Users
Mở `seed.js` và tìm phần "CREATE USERS":
```javascript
const users = await userModel.insertMany([
  {
    name: 'Tên của bạn',
    email: 'email@example.com',
    password: hashedPassword,
    // ... các field khác
  }
]);
```

### Chỉnh sửa Products
Mở `seed.js` và tìm phần "CREATE PRODUCTS":
```javascript
const products = await productModel.insertMany([
  {
    name: 'Tên sản phẩm',
    price: 1000000,
    description: 'Mô tả sản phẩm',
    // ... các field khác
  }
]);
```

## Xóa Dữ Liệu Seed (Tuỳ Chọn)

Nếu bạn muốn xóa dữ liệu cũ trước khi seed, bỏ comment dòng này trong `seed.js`:

```javascript
// Uncomment to clear existing data
await userModel.deleteMany({});
await productModel.deleteMany({});
```

Sau đó chạy:
```bash
npm run seed
```

## Lỗi Thường Gặp

### ❌ "Cannot find module 'mongoose'"
**Giải pháp**: Chạy `npm install`

### ❌ "MongooseError: Cannot connect to MongoDB"
**Giải pháp**: 
- Kiểm tra `MONGO_URI` trong `.env`
- Đảm bảo MongoDB cluster đang chạy
- Kiểm tra IP whitelist trong MongoDB Atlas

### ❌ "DuplicateKeyError"
**Giải pháp**: 
- Email đã tồn tại trong database
- Bỏ comment dòng `deleteMany()` để xóa dữ liệu cũ

### ❌ "E11000 duplicate key error"
**Giải pháp**: Xóa collection `users` và `products` rồi chạy seed lại

## Tiếp Theo

Sau khi seed thành công:
1. Khởi động server: `npm run dev`
2. Truy cập Client: `http://localhost:5173`
3. Truy cập Admin: `http://localhost:5174`
4. Đăng nhập với tài khoản test được tạo

---

**💡 Tip**: Giữ file `seed.js` để có thể reset database dễ dàng khi phát triển!
