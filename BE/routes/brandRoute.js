import express from 'express';
import {
  getAllBrands,
  getSingleBrand,
  addBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brandController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBrands);
router.get('/:id', getSingleBrand);

// Admin routes
router.post('/', adminAuth, addBrand);
router.put('/:id', adminAuth, updateBrand);
router.delete('/:id', adminAuth, deleteBrand);

export default router;
