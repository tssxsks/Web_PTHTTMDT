import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import userModel from './models/userModel.js';
import productModel from './models/productModel.js';
import brandModel from './models/brandModel.js';
import mainTypeModel from './models/mainTypeModel.js';
import productTypeModel from './models/productTypeModel.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await userModel.deleteMany({});
    await productModel.deleteMany({});
    await brandModel.deleteMany({});
    await mainTypeModel.deleteMany({});
    await productTypeModel.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ===== CREATE MAIN TYPES =====
    const mainTypes = await mainTypeModel.insertMany([
      { name: 'shoes', displayName: 'Giày', description: 'Loại giày thường ngày' },
      { name: 'sandals', displayName: 'Dép', description: 'Dép đi mùa hè' }
    ]);
    console.log(`✅ Created ${mainTypes.length} main types`);

    const shoesMainType = mainTypes[0]._id;
    const sandalsMainType = mainTypes[1]._id;

    // ===== CREATE PRODUCT TYPES =====
    const productTypes = await productTypeModel.insertMany([
      { name: 'sport', displayName: 'Thể thao', mainType: shoesMainType, description: 'Giày chạy bộ và thể thao' },
      { name: 'casual', displayName: 'Casual', mainType: shoesMainType, description: 'Giày đi chơi hàng ngày' },
      { name: 'formal', displayName: 'Formal', mainType: shoesMainType, description: 'Giày trang trọng' },
      { name: 'boot', displayName: 'Boot', mainType: shoesMainType, description: 'Giày bốt' },
      { name: 'sandal-casual', displayName: 'Dép Casual', mainType: sandalsMainType, description: 'Dép đi chơi' }
    ]);
    console.log(`✅ Created ${productTypes.length} product types`);

    const sportTypeId = productTypes[0]._id;
    const casualTypeId = productTypes[1]._id;
    const formalTypeId = productTypes[2]._id;
    const bootTypeId = productTypes[3]._id;
    const sandalCasualTypeId = productTypes[4]._id;

    // ===== CREATE BRANDS =====
    const brands = await brandModel.insertMany([
      { name: 'Nike', mainTypes: [shoesMainType, sandalsMainType], description: 'Thương hiệu giày thể thao hàng đầu' },
      { name: 'Adidas', mainTypes: [shoesMainType, sandalsMainType], description: 'Thương hiệu sportswear nổi tiếng' },
      { name: 'Puma', mainTypes: [shoesMainType], description: 'Thương hiệu giày thể thao' },
      { name: 'New Balance', mainTypes: [shoesMainType], description: 'Giày chạy bộ chất lượng cao' },
      { name: 'Converse', mainTypes: [shoesMainType], description: 'Giày canvas kinh điển' },
      { name: 'Timberland', mainTypes: [shoesMainType], description: 'Giày boots chất lượng' },
      { name: 'Skechers', mainTypes: [shoesMainType], description: 'Giày thoải mái cho nữ' },
      { name: 'Steve Madden', mainTypes: [shoesMainType], description: 'Giày cao gót nữ' },
      { name: 'Birkenstock', mainTypes: [sandalsMainType], description: 'Dép sandal thoải mái' },
      { name: 'Crocs', mainTypes: [shoesMainType, sandalsMainType], description: 'Giày và dép thời trang' }
    ]);
    console.log(`✅ Created ${brands.length} brands`);

    const nikeBrandId = brands[0]._id;
    const adidasBrandId = brands[1]._id;
    const pumaBrandId = brands[2]._id;
    const newBalanceBrandId = brands[3]._id;
    const converseBrandId = brands[4]._id;
    const timberlandBrandId = brands[5]._id;
    const sketchersBrandId = brands[6]._id;
    const steveMaddenBrandId = brands[7]._id;
    const birkenstockBrandId = brands[8]._id;
    const crocsBrandId = brands[9]._id;

    // ===== CREATE USERS =====
    const hashedPassword = await bcrypt.hash('user123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    const users = await userModel.insertMany([
      {
        name: 'Nguyễn Văn A',
        email: 'user@example.com',
        password: hashedPassword,
        phone: '0912345678',
        address: {
          street: '123 Đường Lê Lợi',
          ward: 'Phường 1',
          district: 'Quận 1',
          city: 'TP. Hồ Chí Minh'
        }
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        phone: '0987654321',
        role: 'admin',
        address: {
          street: '456 Đường Nguyễn Huệ',
          ward: 'Phường 2',
          district: 'Quận 1',
          city: 'TP. Hồ Chí Minh'
        }
      }
    ]);

    console.log(`✅ Created ${users.length} users`);
    console.log('   User: user@example.com / user123');
    console.log('   Admin: admin@example.com / admin123');

    // ===== CREATE PRODUCTS =====
    const products = await productModel.insertMany([
      {
        name: 'Nike Air Max 90',
        description: 'Giày thể thao cổ điển từ Nike với thiết kế thoải mái và hỗ trợ tốt',
        price: 2500000,
        images: [{ public_id: 'nike-air-max-90', url: 'https://via.placeholder.com/300x300?text=Nike+Air+Max+90' }],
        mainType: shoesMainType,
        productType: sportTypeId,
        age: 'adults',
        gender: 'men',
        brand: nikeBrandId,
        sizes: [
          { size: '6', stock: 10 },
          { size: '7', stock: 12 },
          { size: '8', stock: 15 },
          { size: '9', stock: 14 },
          { size: '10', stock: 11 }
        ],
        color: 'White/Black',
        material: 'Leather & Mesh',
        bestSeller: true
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'Giày chạy bộ hiệu suất cao với công nghệ Boost tối ưu',
        price: 3000000,
        images: [{ public_id: 'adidas-ultraboost-22', url: 'https://via.placeholder.com/300x300?text=Adidas+Ultraboost' }],
        mainType: shoesMainType,
        productType: sportTypeId,
        age: 'adults',
        gender: 'men',
        brand: adidasBrandId,
        sizes: [
          { size: '7', stock: 10 },
          { size: '8', stock: 12 },
          { size: '9', stock: 15 },
          { size: '10', stock: 14 },
          { size: '11', stock: 13 }
        ],
        color: 'Black',
        material: 'Primeknit & Boost',
        bestSeller: true
      },
      {
        name: 'Puma RS-X Softcase',
        description: 'Giày thể thao retro với đệm êm ái cho sự thoải mái cả ngày',
        price: 1800000,
        images: [{ public_id: 'puma-rs-x', url: 'https://via.placeholder.com/300x300?text=Puma+RS-X' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'adults',
        gender: 'men',
        brand: pumaBrandId,
        sizes: [
          { size: '6', stock: 8 },
          { size: '7', stock: 10 },
          { size: '8', stock: 12 },
          { size: '9', stock: 11 }
        ],
        color: 'Red',
        material: 'Suede',
        bestSeller: false
      },
      {
        name: 'New Balance 574',
        description: 'Giày thoải mái với phong cách kinh điển',
        price: 1600000,
        images: [{ public_id: 'new-balance-574', url: 'https://via.placeholder.com/300x300?text=New+Balance+574' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'adults',
        gender: 'men',
        brand: newBalanceBrandId,
        sizes: [
          { size: '6', stock: 10 },
          { size: '7', stock: 12 },
          { size: '8', stock: 15 },
          { size: '9', stock: 13 }
        ],
        color: 'Gray',
        material: 'Mesh',
        bestSeller: false
      },
      {
        name: 'Converse Chuck Taylor All Star',
        description: 'Giày canvas kinh điển được yêu thích trên toàn thế giới',
        price: 1200000,
        images: [{ public_id: 'converse-chuck-taylor', url: 'https://via.placeholder.com/300x300?text=Converse+Chuck+Taylor' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'adults',
        gender: 'unisex',
        brand: converseBrandId,
        sizes: [
          { size: '5', stock: 15 },
          { size: '6', stock: 18 },
          { size: '7', stock: 20 },
          { size: '8', stock: 19 },
          { size: '9', stock: 17 }
        ],
        color: 'White',
        material: 'Canvas',
        bestSeller: true
      },
      {
        name: 'Timberland Classic Boots',
        description: 'Giày boot chất lượng cao từ Timberland',
        price: 4500000,
        images: [{ public_id: 'timberland-boots', url: 'https://via.placeholder.com/300x300?text=Timberland+Boots' }],
        mainType: shoesMainType,
        productType: bootTypeId,
        age: 'adults',
        gender: 'men',
        brand: timberlandBrandId,
        sizes: [
          { size: '7', stock: 8 },
          { size: '8', stock: 9 },
          { size: '9', stock: 10 },
          { size: '10', stock: 9 },
          { size: '11', stock: 7 }
        ],
        color: 'Brown',
        material: 'Leather',
        bestSeller: false
      },
      {
        name: 'Nike Air Force 1 Women',
        description: 'Giày thể thao nữ phiên bản cổ điển với thiết kế hiện đại',
        price: 2200000,
        images: [{ public_id: 'nike-air-force-women', url: 'https://via.placeholder.com/300x300?text=Nike+Air+Force+Women' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'adults',
        gender: 'women',
        brand: nikeBrandId,
        sizes: [
          { size: '5', stock: 12 },
          { size: '6', stock: 14 },
          { size: '7', stock: 16 },
          { size: '8', stock: 15 },
          { size: '9', stock: 13 }
        ],
        color: 'White',
        material: 'Leather',
        bestSeller: true
      },
      {
        name: 'Adidas Gazelle Women',
        description: 'Giày nữ retro với thiết kế tối giản và tinh tế',
        price: 1900000,
        images: [{ public_id: 'adidas-gazelle-women', url: 'https://via.placeholder.com/300x300?text=Adidas+Gazelle+Women' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'adults',
        gender: 'women',
        brand: adidasBrandId,
        sizes: [
          { size: '5', stock: 10 },
          { size: '6', stock: 12 },
          { size: '7', stock: 14 },
          { size: '8', stock: 13 }
        ],
        color: 'Pink',
        material: 'Suede',
        bestSeller: false
      },
      {
        name: 'Skechers Arch Fit Women',
        description: 'Giày nữ thoải mái với đệm hỗ trợ vòm chân',
        price: 1500000,
        images: [{ public_id: 'skechers-arch-fit', url: 'https://via.placeholder.com/300x300?text=Skechers+Arch+Fit' }],
        mainType: shoesMainType,
        productType: sportTypeId,
        age: 'adults',
        gender: 'women',
        brand: sketchersBrandId,
        sizes: [
          { size: '5', stock: 10 },
          { size: '6', stock: 12 },
          { size: '7', stock: 14 },
          { size: '8', stock: 12 }
        ],
        color: 'Black/Gray',
        material: 'Mesh',
        bestSeller: false
      },
      {
        name: 'Steve Madden Heels',
        description: 'Giày cao gót nữ thanh lịch cho các dịp đặc biệt',
        price: 2800000,
        images: [{ public_id: 'steve-madden-heels', url: 'https://via.placeholder.com/300x300?text=Steve+Madden+Heels' }],
        mainType: shoesMainType,
        productType: formalTypeId,
        age: 'adults',
        gender: 'women',
        brand: steveMaddenBrandId,
        sizes: [
          { size: '5', stock: 8 },
          { size: '6', stock: 10 },
          { size: '7', stock: 12 },
          { size: '8', stock: 9 }
        ],
        color: 'Black',
        material: 'Leather',
        bestSeller: true
      },
      {
        name: 'Birkenstock Sandals',
        description: 'Giày sandal thoải mái và bền bỉ cho mùa hè',
        price: 1600000,
        images: [{ public_id: 'birkenstock-sandals', url: 'https://via.placeholder.com/300x300?text=Birkenstock+Sandals' }],
        mainType: sandalsMainType,
        productType: sandalCasualTypeId,
        age: 'adults',
        gender: 'women',
        brand: birkenstockBrandId,
        sizes: [
          { size: '5', stock: 12 },
          { size: '6', stock: 14 },
          { size: '7', stock: 16 },
          { size: '8', stock: 15 },
          { size: '9', stock: 13 }
        ],
        color: 'Brown',
        material: 'Cork',
        bestSeller: false
      },
      {
        name: 'Nike Revolution Kids',
        description: 'Giày thể thao cho trẻ em với thiết kế vui nhộn',
        price: 800000,
        images: [{ public_id: 'nike-revolution-kids', url: 'https://via.placeholder.com/300x300?text=Nike+Kids' }],
        mainType: shoesMainType,
        productType: sportTypeId,
        age: 'kids',
        gender: 'unisex',
        brand: nikeBrandId,
        sizes: [
          { size: '5', stock: 15 },
          { size: '6', stock: 17 },
          { size: '7', stock: 19 },
          { size: '8', stock: 18 }
        ],
        color: 'Multi',
        material: 'Synthetic',
        bestSeller: true
      },
      {
        name: 'Adidas Stan Smith Kids',
        description: 'Giày trẻ em cổ điển với thiết kế đơn giản',
        price: 900000,
        images: [{ public_id: 'adidas-stan-smith-kids', url: 'https://via.placeholder.com/300x300?text=Adidas+Stan+Smith+Kids' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'kids',
        gender: 'unisex',
        brand: adidasBrandId,
        sizes: [
          { size: '5', stock: 12 },
          { size: '6', stock: 14 },
          { size: '7', stock: 16 },
          { size: '8', stock: 15 },
          { size: '9', stock: 13 }
        ],
        color: 'White/Green',
        material: 'Leather',
        bestSeller: false
      },
      {
        name: 'Crocs Kids',
        description: 'Giày lười thoải mái cho trẻ em',
        price: 600000,
        images: [{ public_id: 'crocs-kids', url: 'https://via.placeholder.com/300x300?text=Crocs+Kids' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'kids',
        gender: 'unisex',
        brand: crocsBrandId,
        sizes: [
          { size: '5', stock: 20 },
          { size: '6', stock: 22 },
          { size: '7', stock: 25 },
          { size: '8', stock: 23 }
        ],
        color: 'Blue',
        material: 'Croslite',
        bestSeller: false
      },
      {
        name: 'Puma Suede Kids',
        description: 'Giày trẻ em với chất liệu suede mềm mại',
        price: 850000,
        images: [{ public_id: 'puma-suede-kids', url: 'https://via.placeholder.com/300x300?text=Puma+Suede+Kids' }],
        mainType: shoesMainType,
        productType: casualTypeId,
        age: 'kids',
        gender: 'unisex',
        brand: pumaBrandId,
        sizes: [
          { size: '5', stock: 13 },
          { size: '6', stock: 15 },
          { size: '7', stock: 17 },
          { size: '8', stock: 16 }
        ],
        color: 'Orange',
        material: 'Suede',
        bestSeller: false
      }
    ]);

    console.log(`✅ Created ${products.length} products`);
    console.log('\n📊 Product Structure:');
    console.log('   MainTypes: Giày, Dép');
    console.log('   ProductTypes: Thể thao, Casual, Formal, Boot, Dép Casual');
    console.log('   Brands: Nike, Adidas, Puma, New Balance, Converse, Timberland, Skechers, Steve Madden, Birkenstock, Crocs');
    console.log('   Ages: Adults, Kids');
    console.log('   Genders: Men, Women, Unisex');

    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
