import express from 'express';
import { 
  addProduct, 
  listProducts, 
  singleProduct, 
  updateProduct, 
  removeProduct, 
  importProductsFromAssets 
} from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';
import { upload } from '../config/cloudinary.js';
const router = express.Router();

// Public routes
router.get('/', listProducts);
router.get('/:id', singleProduct);

// Admin routes
router.post('/', adminAuth, upload.array('images', 5), addProduct);
router.put('/:id', adminAuth, upload.array('images', 5), updateProduct);
router.delete('/:id', adminAuth, removeProduct);
router.post('/import', adminAuth, importProductsFromAssets);

export default router;