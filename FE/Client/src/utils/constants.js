// Phương thức thanh toán
export const PAYMENT_METHODS = {
  COD: 'Thanh toán khi nhận hàng',
  STRIPE: 'Stripe',
  RAZORPAY: 'Razorpay',
  VNPAY: 'VNPay',
  MOMO: 'Momo',
  SOLANA: 'Solana',
};

// Trạng thái đơn hàng và màu sắc
export const ORDER_STATUS_COLORS = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  shipped: { bg: 'bg-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
  returned: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
};

// Kích cỡ giày
export const SHOE_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12', '13'];

// ============ PRODUCT FILTERS ============
// Note: MAIN_TYPES, PRODUCT_TYPES, BRANDS are now fetched dynamically from backend
// These constants are kept for reference only and UI defaults

// 1. Loại sản phẩm chính (Main Type) - DEPRECATED: Fetch from /api/maintype
export const MAIN_TYPES = [
  { name: 'Giày', value: 'shoes' },
  { name: 'Dép', value: 'sandals' },
  { name: 'Bốt', value: 'boots' },
  { name: 'Lười', value: 'loafers' },
  { name: 'Dép xỏ', value: 'slippers' },
];

// 2. Dành cho (Age)
export const AGES = [
  { name: 'Người lớn', value: 'adults' },
  { name: 'Trẻ em', value: 'kids' },
];

// 3. Giới tính (Gender)
export const GENDERS = [
  { name: 'Nam', value: 'men' },
  { name: 'Nữ', value: 'women' },
  { name: 'Unisex', value: 'unisex' },
];

// 4. Loại sản phẩm (Product Type) - DEPRECATED: Fetch from /api/producttype?mainType=xxx
export const PRODUCT_TYPES = [
  { name: 'Thể thao', value: 'sport' },
  { name: 'Lười', value: 'lazy' },
  { name: 'Casual', value: 'casual' },
  { name: 'Formal', value: 'formal' },
  { name: 'Boot', value: 'boot' },
  { name: 'Cao gót', value: 'heels' },
];

// 5. Hãng / Brand - DEPRECATED: Fetch from /api/brand?mainType=xxx
export const BRANDS = [
  { name: 'Nike', value: 'nike' },
  { name: 'Adidas', value: 'adidas' },
  { name: 'Puma', value: 'puma' },
  { name: 'Reebok', value: 'reebok' },
  { name: 'New Balance', value: 'newbalance' },
];

// Giá filter ranges
export const PRICE_RANGES = [
  { name: 'Tất cả giá', min: 0, max: 10000000 },
  { name: 'Dưới 500K', min: 0, max: 500000 },
  { name: '500K - 1M', min: 500000, max: 1000000 },
  { name: '1M - 2M', min: 1000000, max: 2000000 },
  { name: 'Trên 2M', min: 2000000, max: 10000000 },
];

// Old structure for backward compatibility
export const SUBCATEGORIES = {
  men: ['Giày thể thao', 'Giày lười', 'Giày boot', 'Giày hàng ngày'],
  women: ['Giày thể thao', 'Giày hàng ngày', 'Giày cao gót', 'Giày sandal'],
  kids: ['Giày thể thao', 'Giày hàng ngày', 'Giày bốt'],
};
