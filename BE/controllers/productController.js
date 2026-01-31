import Product from '../models/productModel.js';
import { getPagination } from '../utils/pagination.js';
import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

// @desc    Add a new product
// @route   POST /api/product
// @access  Private/Admin
export const addProduct = async (req, res) => {
  console.log('files:', req.files?.length);
  console.log('body:', req.body);
  try {

    const {
      name,
      description,
      price,
      mainType,
      productType,
      age,
      gender,
      brand,
      sizes,
      bestSeller,
      featured,
    } = req.body;

    if (!name || !description || !price || !mainType || !productType || !brand || !sizes) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // parse sizes
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    // cloudinary files
    const images = req.files.map(file => ({
      public_id: file.filename,   // cloudinary public_id
      url: file.path,             // cloudinary secure_url
    }));

    const product = await Product.create({
      name,
      description,
      price,
      mainType,
      productType,
      brand,
      sizes: parsedSizes,
      age: age || undefined,
      gender: gender || undefined,
      bestSeller: bestSeller === "true" || bestSeller === true,
      featured: featured === "true" || featured === true,
      images,
    });

    await product.populate(["mainType", "productType", "brand"]);

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// @desc    Get all products with filters and pagination
// @route   GET /api/product
// @access  Public
export const listProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      mainType,
      productType,
      age,
      gender,
      brand,
      sort,
      search,
      bestSeller,
      featured
    } = req.query;

    // Build filter object
    const filter = {};
    if (mainType) filter.mainType = mainType;
    if (productType) filter.productType = productType;
    if (age) filter.age = age;
    if (gender) filter.gender = gender;
    if (brand) filter.brand = brand;
    if (bestSeller) filter.bestSeller = bestSeller === 'true';
    if (featured) filter.featured = featured === 'true';
    
    // Add search query if provided
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'name-asc':
          sortOptions = { name: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      // Default sort by newest
      sortOptions = { createdAt: -1 };
    }

    // Count total documents
    const totalItems = await Product.countDocuments(filter);

    // Get pagination details
    const pagination = getPagination(page, limit, totalItems);

    // Find products with pagination and populate references
    const products = await Product.find(filter)
      .populate(['mainType', 'productType', 'brand'])
      .sort(sortOptions)
      .skip(pagination.skip)
      .limit(pagination.limit);

    const result = {
      success: true,
      pagination,
      products
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get a single product
// @route   GET /api/product/:id
// @access  Public
export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID with populated references
    const product = await Product.findById(id)
      .populate(['mainType', 'productType', 'brand']);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const result = {
      success: true,
      product
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Update a product
// @route   PUT /api/product/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Parse sizes if provided as string
    if (updateData.sizes && typeof updateData.sizes === 'string') {
      try {
        updateData.sizes = JSON.parse(updateData.sizes);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid sizes format',
        });
      }
    }

    // 1. Tìm sản phẩm trong DB
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // 2. Cập nhật các thông tin văn bản (trừ images)
    Object.keys(updateData).forEach(key => {
      if (key !== 'images') {
        product[key] = updateData[key];
      }
    });

    // 3. Xử lý logic ẢNH (QUAN TRỌNG)
    // Chỉ thực hiện xóa cũ thay mới NẾU người dùng có upload ảnh mới
    if (req.files && req.files.length > 0) {
      
      // A. Xóa ảnh cũ trên Cloudinary để tránh rác server
      if (product.images && product.images.length > 0) {
        const oldPublicIds = product.images.map(image => image.public_id);
        // Dùng Promise.all để xóa nhanh hoặc dùng api.delete_resources
        try {
            await cloudinary.api.delete_resources(oldPublicIds);
        } catch (cloudinaryError) {
            console.error("Cloudinary delete error (warning only):", cloudinaryError);
            // Không return lỗi ở đây để code vẫn tiếp tục chạy việc update
        }
      }

      // B. Tạo danh sách ảnh mới từ req.files
      const newImages = req.files.map(file => ({
        public_id: file.filename,
        url: file.path
      }));
      
      // C. THAY THẾ hoàn toàn ảnh cũ bằng ảnh mới
      product.images = newImages; 
    }
    // Lưu ý: Nếu req.files rỗng (người dùng không chọn ảnh mới), 
    // thì product.images giữ nguyên giá trị cũ, không bị mất ảnh.

    // 4. Lưu lại vào DB
    await product.save();

    // Populate để trả về data đầy đủ hiển thị luôn nếu cần
    await product.populate(['mainType', 'productType', 'brand']);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/product/:id
// @access  Private/Admin
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from cloudinary
    if (product.images && product.images.length > 0) {
      const publicIds = product.images.map(image => image.public_id);
      await cloudinary.api.delete_resources(publicIds);
    }

    // Delete product from DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Import products from assets (for development/testing)
// @route   POST /api/product/import
// @access  Private/Admin
export const importProductsFromAssets = async (req, res) => {
  try {
    // Path to sample products JSON file
    const sampleDataPath = path.join(process.cwd(), 'assets', 'sampleProducts.json');
    
    // Check if file exists
    if (!fs.existsSync(sampleDataPath)) {
      return res.status(404).json({
        success: false,
        message: 'Sample products file not found'
      });
    }

    // Read and parse sample data
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
    
    // Insert products
    await Product.insertMany(sampleData);

    res.status(201).json({
      success: true,
      message: `${sampleData.length} products imported successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error importing products',
      error: error.message
    });
  }
};
