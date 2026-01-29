import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/mongodb.js';

// Import routes
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoute.js';
import mainTypeRoute from './routes/mainTypeRoute.js';
import productTypeRoute from './routes/productTypeRoute.js';
import brandRoute from './routes/brandRoute.js';
import sizeRoute from './routes/sizeRoute.js';

// Import middlewares
import { rateLimiter } from './middleware/rateLimit.js';

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// ...existing code...

// Middlewares
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from public directory
app.use(express.static('public'));

// Apply rate limiter to all routes
app.use(rateLimiter);

// Routes
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
app.use('/api/maintype', mainTypeRoute);
app.use('/api/producttype', productTypeRoute);
app.use('/api/brand', brandRoute);
app.use('/api/size', sizeRoute);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => {
    process.exit(1);
  });
});