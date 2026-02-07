import express from 'express';
import {
  getActiveBanners,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../controllers/bannerController.js';
import adminAuth from '../middleware/adminAuth.js';
import { uploadBanner } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveBanners);

// Admin routes
router.get('/', adminAuth, getAllBanners);
router.post('/', adminAuth, uploadBanner.single('image'), createBanner);
router.put('/:id', adminAuth, uploadBanner.single('image'), updateBanner);
router.delete('/:id', adminAuth, deleteBanner);
router.patch('/:id/toggle', adminAuth, toggleBannerStatus);

// Public route (để cuối)
router.get('/:id', getBannerById);

export default router;
