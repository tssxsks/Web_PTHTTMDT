import express from 'express';
import { 
  getAllSizes, 
  getSingleSize, 
  addSize, 
  updateSize, 
  deleteSize 
} from '../controllers/sizeController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSizes);
router.get('/:id', getSingleSize);

// Admin protected routes
router.post('/', adminAuth, addSize);
router.put('/:id', adminAuth, updateSize);
router.delete('/:id', adminAuth, deleteSize);

export default router;
