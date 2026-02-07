import Banner from '../models/bannerModel.js';
import { cloudinary } from '../config/cloudinary.js';

// Get all active banners (client)
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({
      isActive: true,
      startDate: { $lte: new Date() },
      $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
    }).sort({ priority: -1 });

    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all banners (admin)
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ priority: -1 });
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get banner by id
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create banner
export const createBanner = async (req, res) => {
  try {
    const { title, link, description, priority, startDate, endDate } = req.body;

    if (!title || !link || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Title, link and image are required',
      });
    }

    // CloudinaryStorage handles upload, just use the file properties
    const banner = await Banner.create({
      title,
      link,
      description,
      priority,
      startDate,
      endDate: endDate || null,
      imageUrl: req.file.path,        // secure_url from Cloudinary
      imagePublicId: req.file.filename, // public_id from Cloudinary
    });

    res.status(201).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const { title, link, description, priority, startDate, endDate, isActive } = req.body;

    if (title !== undefined) banner.title = title;
    if (link !== undefined) banner.link = link;
    if (description !== undefined) banner.description = description;
    if (priority !== undefined) banner.priority = priority;
    if (startDate !== undefined) banner.startDate = startDate;
    if (endDate !== undefined) banner.endDate = endDate || null;
    if (isActive !== undefined) banner.isActive = isActive === 'true';

    if (req.file) {
      if (banner.imagePublicId) {
        await cloudinary.uploader.destroy(banner.imagePublicId);
      }

      // CloudinaryStorage handles upload, just use the file properties
      banner.imageUrl = req.file.path;        // secure_url from Cloudinary
      banner.imagePublicId = req.file.filename; // public_id from Cloudinary
    }

    await banner.save();
    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (banner.imagePublicId) {
      await cloudinary.uploader.destroy(banner.imagePublicId);
    }

    await banner.deleteOne();
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle banner active status
export const toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
