import express from 'express';
import {
  getAllMainTypes,
  getSingleMainType,
  addMainType,
  updateMainType,
  deleteMainType
} from '../controllers/mainTypeController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getAllMainTypes);
router.get('/:id', getSingleMainType);

// Admin routes
router.post('/', adminAuth, addMainType);
router.put('/:id', adminAuth, updateMainType);
router.delete('/:id', adminAuth, deleteMainType);

export default router;
