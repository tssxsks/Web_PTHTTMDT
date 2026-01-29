import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    
    if (!productId || !quantity || !size) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID, quantity, and size'
      });
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if size is available
    const sizeObj = product.sizes.find(s => s.size === Number(size));
    if (!sizeObj) {
      return res.status(400).json({
        success: false,
        message: 'Selected size is not available for this product'
      });
    }

    // Check if there's enough stock
    if (sizeObj.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available for the selected size'
      });
    }

    // Get user cart
    const user = await User.findById(req.user._id);
    
    // Check if user has a cart property
    if (!user.cart) {
      user.cart = {
        items: [],
        totalAmount: 0
      };
    }

    // Check if product already exists in cart with same size
    const existingItemIndex = user.cart.items.findIndex(
      item => item.product.toString() === productId && item.size === Number(size)
    );

    if (existingItemIndex > -1) {
      // Update quantity if product exists
      user.cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      // Add new item to cart
      user.cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size: Number(size),
        price: product.price
      });
    }

    // Update cart total
    user.cart.totalAmount = user.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );

    // Save updated user
    await user.save();

    // Populate product info for response
    await user.populate({
      path: 'cart.items.product',
      select: 'name images price'
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart (quantity, remove item)
// @route   PUT /api/cart/update
// @access  Private
export const updateCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    
    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID, size, and quantity'
      });
    }

    // Get user
    const user = await User.findById(req.user._id);
    
    if (!user.cart) {
      user.cart = { items: [], totalAmount: 0 };
    }

    // Find item index
    const itemIndex = user.cart.items.findIndex(
      item => item.product.toString() === productId && item.size === Number(size)
    );

    if (itemIndex > -1) {
      if (Number(quantity) > 0) {
        user.cart.items[itemIndex].quantity = Number(quantity);
      } else {
        // Remove item if quantity is 0
        user.cart.items.splice(itemIndex, 1);
      }
    }

    // Recalculate total
    user.cart.totalAmount = user.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );

    // Save updated user
    await user.save();

    // Populate product info
    await user.populate({
      path: 'cart.items.product',
      select: 'name images price'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID and size'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.cart) {
      user.cart.items = user.cart.items.filter(
        item => !(item.product.toString() === productId && item.size === Number(size))
      );

      user.cart.totalAmount = user.cart.items.reduce(
        (total, item) => total + (item.price * item.quantity), 0
      );

      await user.save();
      
      await user.populate({
        path: 'cart.items.product',
        select: 'name images price'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getUserCart = async (req, res) => {
  try {
    // Get user with populated cart items
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.items.product',
        select: 'name images price'
      });

    if (!user.cart) {
      user.cart = {
        items: [],
        totalAmount: 0
      };
      await user.save();
    }

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// @desc    Clear all items from cart
// @route   POST /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && user.cart) {
      user.cart.items = [];
      user.cart.totalAmount = 0;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: user.cart || { items: [], totalAmount: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};