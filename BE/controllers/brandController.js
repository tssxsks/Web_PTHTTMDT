import Brand from '../models/brandModel.js';

// @desc    Get all brands (optionally filter by mainType)
// @route   GET /api/brand?mainType=xxx
// @access  Public
export const getAllBrands = async (req, res) => {
  try {
    const { mainType } = req.query;
    const filter = {};

    if (mainType) {
      filter.mainTypes = mainType;
    }

    const brands = await Brand.find(filter).populate('mainTypes', 'name displayName');
    res.status(200).json({
      success: true,
      brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

// @desc    Get single brand
// @route   GET /api/brand/:id
// @access  Public
export const getSingleBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).populate('mainTypes', 'name displayName');

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.status(200).json({
      success: true,
      brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brand',
      error: error.message
    });
  }
};

// @desc    Add a brand
// @route   POST /api/brand
// @access  Private/Admin
export const addBrand = async (req, res) => {
  try {
    const { name, mainTypes, description } = req.body;

    if (!name || !mainTypes || mainTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and at least one main type'
      });
    }

    const brand = await Brand.create({
      name,
      mainTypes,
      description: description || ''
    });

    await brand.populate('mainTypes', 'name displayName');

    res.status(201).json({
      success: true,
      brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding brand',
      error: error.message
    });
  }
};

// @desc    Update brand
// @route   PUT /api/brand/:id
// @access  Private/Admin
export const updateBrand = async (req, res) => {
  try {
    const { name, mainTypes, description } = req.body;

    let brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, mainTypes, description },
      { new: true, runValidators: true }
    ).populate('mainTypes', 'name displayName');

    res.status(200).json({
      success: true,
      brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating brand',
      error: error.message
    });
  }
};

// @desc    Delete brand
// @route   DELETE /api/brand/:id
// @access  Private/Admin
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting brand',
      error: error.message
    });
  }
};
