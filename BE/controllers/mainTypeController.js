import MainType from '../models/mainTypeModel.js';
import { cloudinary } from '../config/cloudinary.js';

/**
 * @desc    Get all main types
 * @route   GET /api/maintype
 * @access  Public
 */
export const getAllMainTypes = async (req, res) => {
  try {
    // Sắp xếp theo priority giảm dần (số lớn hiện trước)
    const mainTypes = await MainType.find().sort({ priority: -1 });
    res.status(200).json({
      success: true,
      mainTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách loại chính',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single main type
 */
export const getSingleMainType = async (req, res) => {
  try {
    const mainType = await MainType.findById(req.params.id);
    if (!mainType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    }
    res.status(200).json({ success: true, mainType });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Add a main type
 * @route   POST /api/maintype
 * @access  Private/Admin
 */
export const addMainType = async (req, res) => {
  try {
    const { name, displayName, description, priority, isActive } = req.body;

    // KIỂM TRA INPUT BẮT BUỘC
    if (!name || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập Slug và Tên hiển thị',
      });
    }

    // XỬ LÝ ÉP KIỂU TỪ FORM DATA (Vì FormData gửi mọi thứ là String)
    const formattedPriority = Number(priority) || 0;
    // Chuỗi "false" hoặc "true" từ FE gửi lên cần so sánh chuẩn
    const formattedIsActive = String(isActive) === 'true';

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng upload ảnh cho loại chính',
      });
    }

    // CloudinaryStorage handles upload, just use the file properties
    const imageData = {
      imageUrl: req.file.path,        // secure_url from Cloudinary
      imagePublicId: req.file.filename, // public_id from Cloudinary
    };

    const mainType = await MainType.create({
      name,
      displayName,
      description: description || '',
      priority: formattedPriority,
      isActive: formattedIsActive,
      ...imageData,
    });

    res.status(201).json({
      success: true,
      mainType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi thêm loại chính',
      error: error.message,
    });
  }
};

/**
 * @desc    Update main type
 * @route   PUT /api/maintype/:id
 */
export const updateMainType = async (req, res) => {
  try {
    const { name, displayName, description, priority, isActive } = req.body;
    const mainType = await MainType.findById(req.params.id);

    if (!mainType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    }

    // Cập nhật text fields
    if (name !== undefined) mainType.name = name;
    if (displayName !== undefined) mainType.displayName = displayName;
    if (description !== undefined) mainType.description = description;

    // XỬ LÝ ÉP KIỂU KHI UPDATE
    if (priority !== undefined) mainType.priority = Number(priority);
    if (isActive !== undefined) {
      mainType.isActive = String(isActive) === 'true';
    }

    // Xử lý ảnh mới nếu có
    if (req.file) {
      // Xóa ảnh cũ
      if (mainType.imagePublicId) {
        await cloudinary.uploader.destroy(mainType.imagePublicId);
      }
      // CloudinaryStorage handles upload, just use the file properties
      mainType.imageUrl = req.file.path;        // secure_url from Cloudinary
      mainType.imagePublicId = req.file.filename; // public_id from Cloudinary
    }

    await mainType.save();

    res.status(200).json({
      success: true,
      mainType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật',
      error: error.message,
    });
  }
};

/**
 * @desc    Toggle status nhanh (Dùng cho nút bấm ngoài bảng)
 * @route   PATCH /api/maintype/:id/toggle_mts
 */
export const toggleMainTypeStatus = async (req, res) => {
  try {
    const mainType = await MainType.findById(req.params.id);
    if (!mainType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    }

    mainType.isActive = !mainType.isActive;
    await mainType.save();

    res.status(200).json({
      success: true,
      isActive: mainType.isActive,
      message: 'Đã cập nhật trạng thái',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete main type
 */
export const deleteMainType = async (req, res) => {
  try {
    const mainType = await MainType.findById(req.params.id);
    if (!mainType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    }

    if (mainType.imagePublicId) {
      await cloudinary.uploader.destroy(mainType.imagePublicId);
    }

    await mainType.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa',
      error: error.message,
    });
  }
};