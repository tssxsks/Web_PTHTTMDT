import express from 'express';
import {
  getAllMainTypes,
  getSingleMainType,
  addMainType,
  updateMainType,
  deleteMainType,
  toggleMainTypeStatus
} from '../controllers/mainTypeController.js';
import adminAuth from '../middleware/adminAuth.js';
import { uploadMainType } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getAllMainTypes);
router.get('/:id', getSingleMainType);

// Admin routes
router.post('/', adminAuth, uploadMainType.single('image'), addMainType);
router.put('/:id', adminAuth, uploadMainType.single('image'), updateMainType);
router.delete('/:id', adminAuth, deleteMainType);
router.patch('/:id/toggle_mts', adminAuth, toggleMainTypeStatus);

export default router;
