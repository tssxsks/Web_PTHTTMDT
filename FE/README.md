# Shoe Store - Web Bán Giày Dép

Đây là một ứng dụng web bán giày dép hiện đại được xây dựng bằng React + Vite cho Frontend và Node.js/Express cho Backend.

## Cấu trúc Dự án

```
Web_Giay_Dep/
├── FE/
│   ├── Client/          # Website khách hàng
│   └── Admin/           # Dashboard quản trị
├── BE/                  # Backend API
└── Chatbot/            # AI Chatbot
```

## Tính Năng

### Frontend (Client)
- ✓ Trang chủ với hero banner
- ✓ Danh sách sản phẩm với bộ lọc theo danh mục
- ✓ Chi tiết sản phẩm
- ✓ Giỏ hàng
- ✓ Thanh toán với nhiều phương thức (COD, Stripe, VNPay, Momo, Razorpay, Solana)
- ✓ Quản lý tài khoản người dùng
- ✓ Lịch sử đơn hàng
- ✓ Chatbot AI hỗ trợ 24/7
- ✓ Responsive design cho mobile, tablet, desktop

### Frontend (Admin)
- ✓ Dashboard thống kê
- ✓ Quản lý sản phẩm (CRUD)
- ✓ Quản lý đơn hàng
- ✓ Thống kê doanh thu
- ✓ Xác thực admin

### Backend
- ✓ API RESTful hoàn chỉnh
- ✓ Xác thực JWT
- ✓ Quản lý sản phẩm
- ✓ Quản lý giỏ hàng
- ✓ Quản lý đơn hàng
- ✓ Tích hợp thanh toán đa nền tảng
- ✓ Upload ảnh Cloudinary
- ✓ Redis caching
- ✓ Rate limiting

## Yêu Cầu

- Node.js 16+
- npm hoặc yarn
- MongoDB
- Redis (tuỳ chọn)

## Cài Đặt

### 1. Client (Khách Hàng)

```bash
cd FE/Client
npm install
```

Tạo file `.env`:
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Shoe Store
```

Chạy:
```bash
npm run dev
# Website sẽ chạy ở http://localhost:5173
```

### 2. Admin

```bash
cd FE/Admin
npm install
```

Tạo file `.env`:
```env
VITE_API_URL=http://localhost:4000
```

Chạy:
```bash
npm run dev
# Admin dashboard sẽ chạy ở http://localhost:5174
```

### 3. Backend

```bash
cd BE
npm install
```

Tạo file `.env`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/shoe-store
JWT_SECRET=your_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

Chạy:
```bash
npm start
# Server sẽ chạy ở http://localhost:4000
```

## Tài Khoản Test

### Admin
- Email: admin@example.com
- Password: admin123

### Khách Hàng
- Email: user@example.com
- Password: user123

## API Endpoints

### Sản phẩm
- `GET /api/product` - Lấy danh sách sản phẩm
- `GET /api/product/:id` - Lấy chi tiết sản phẩm
- `POST /api/product/add` - Thêm sản phẩm (Admin)
- `PUT /api/product/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/product/:id` - Xóa sản phẩm (Admin)

### Người Dùng
- `POST /api/user/register` - Đăng ký
- `POST /api/user/login` - Đăng nhập
- `POST /api/user/admin-login` - Đăng nhập admin
- `GET /api/user/profile` - Lấy profile (Yêu cầu token)
- `PUT /api/user/profile` - Cập nhật profile (Yêu cầu token)

### Giỏ Hàng
- `GET /api/cart` - Lấy giỏ hàng (Yêu cầu token)
- `POST /api/cart/add` - Thêm vào giỏ
- `PUT /api/cart/update` - Cập nhật giỏ
- `DELETE /api/cart/remove` - Xóa khỏi giỏ

### Đơn Hàng
- `POST /api/order/place` - Đặt hàng
- `GET /api/order` - Lấy đơn hàng của user (Yêu cầu token)
- `GET /api/order/all-orders` - Lấy tất cả đơn (Admin)
- `PUT /api/order/update-status/:id` - Cập nhật trạng thái

## Phương Thức Thanh Toán

1. **COD (Cash on Delivery)** - Thanh toán khi nhận hàng
2. **Stripe** - Thẻ tín dụng quốc tế
3. **VNPay** - Thanh toán Việt Nam
4. **Momo** - Ví điện tử Momo
5. **Razorpay** - Thanh toán Ấn Độ
6. **Solana** - Blockchain payment

## Công Nghệ Sử Dụng

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - CSS framework
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **Redis** - Caching
- **Stripe, VNPay, Momo** - Payment gateways

## Tùy Chỉnh Giao Diện

### Màu sắc
Chỉnh sửa `tailwind.config.js`:
```js
colors: {
  'primary': '#B91C1C',    // Đỏ
  'primary-dark': '#7F1D1D'
}
```

### Font
Chỉnh sửa trong `index.html` hoặc `tailwind.config.js`

### Logo
Thay đổi logo ở `Navbar.jsx`

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Heroku/Railway)
```bash
npm start
```

## Troubleshooting

### CORS Error
Đảm bảo Backend đang chạy và CORS được cấu hình đúng trong `server.js`

### Token Hết Hạn
Frontend sẽ tự động chuyển hướng đến login khi token hết hạn

### Database Connection
Kiểm tra MongoDB URL trong `.env` của Backend

## Hỗ Trợ

Liên hệ: support@shoestore.com

## License

MIT License

---

**Created with ❤️ by Shoe Store Team**
