import express from 'express';
import {
  getAllProductTypes,
  getSingleProductType,
  addProductType,
  updateProductType,
  deleteProductType
} from '../controllers/productTypeController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProductTypes);
router.get('/:id', getSingleProductType);

// Admin routes
router.post('/', adminAuth, addProductType);
router.put('/:id', adminAuth, updateProductType);
router.delete('/:id', adminAuth, deleteProductType);

export default router;
