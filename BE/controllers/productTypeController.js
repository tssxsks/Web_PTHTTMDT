import ProductType from '../models/productTypeModel.js';

// @desc    Get all product types (optionally filter by mainType)
// @route   GET /api/producttype?mainType=xxx
// @access  Public
export const getAllProductTypes = async (req, res) => {
  try {
    const { mainType } = req.query;
    const filter = {};

    if (mainType) {
      filter.mainType = mainType;
    }

    const productTypes = await ProductType.find(filter).populate('mainType', 'name displayName');
    res.status(200).json({
      success: true,
      productTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product types',
      error: error.message
    });
  }
};

// @desc    Get single product type
// @route   GET /api/producttype/:id
// @access  Public
export const getSingleProductType = async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id).populate('mainType', 'name displayName');

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found'
      });
    }

    res.status(200).json({
      success: true,
      productType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product type',
      error: error.message
    });
  }
};

// @desc    Add a product type
// @route   POST /api/producttype
// @access  Private/Admin
export const addProductType = async (req, res) => {
  try {
    const { name, displayName, mainType, description } = req.body;

    if (!name || !displayName || !mainType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, display name, and main type'
      });
    }

    const productType = await ProductType.create({
      name,
      displayName,
      mainType,
      description: description || ''
    });

    await productType.populate('mainType', 'name displayName');

    res.status(201).json({
      success: true,
      productType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding product type',
      error: error.message
    });
  }
};

// @desc    Update product type
// @route   PUT /api/producttype/:id
// @access  Private/Admin
export const updateProductType = async (req, res) => {
  try {
    const { name, displayName, mainType, description } = req.body;

    let productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found'
      });
    }

    productType = await ProductType.findByIdAndUpdate(
      req.params.id,
      { name, displayName, mainType, description },
      { new: true, runValidators: true }
    ).populate('mainType', 'name displayName');

    res.status(200).json({
      success: true,
      productType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product type',
      error: error.message
    });
  }
};

// @desc    Delete product type
// @route   DELETE /api/producttype/:id
// @access  Private/Admin
export const deleteProductType = async (req, res) => {
  try {
    const productType = await ProductType.findByIdAndDelete(req.params.id);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product type',
      error: error.message
    });
  }
};
