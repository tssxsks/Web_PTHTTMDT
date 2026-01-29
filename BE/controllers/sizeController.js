import Size from '../models/sizeModel.js';

// @desc    Get all sizes (optionally filter by mainType)
// @route   GET /api/size?mainType=xxx
// @access  Public
export const getAllSizes = async (req, res) => {
  try {
    const { mainType } = req.query;
    const filter = {};

    if (mainType) {
      filter.mainType = mainType;
    }

    const sizes = await Size.find(filter).populate('mainType', 'name displayName');
    res.status(200).json({
      success: true,
      sizes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sizes',
      error: error.message
    });
  }
};

// @desc    Get single size
// @route   GET /api/size/:id
// @access  Public
export const getSingleSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id).populate('mainType', 'name displayName');

    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    res.status(200).json({
      success: true,
      size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching size',
      error: error.message
    });
  }
};

// @desc    Add a size
// @route   POST /api/size
// @access  Private/Admin
export const addSize = async (req, res) => {
  try {
    const { size, mainType, description } = req.body;

    if (!size || !mainType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide size and main type'
      });
    }

    const sizeDoc = await Size.create({
      size,
      mainType,
      description: description || ''
    });

    await sizeDoc.populate('mainType', 'name displayName');

    res.status(201).json({
      success: true,
      size: sizeDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding size',
      error: error.message
    });
  }
};

// @desc    Update size
// @route   PUT /api/size/:id
// @access  Private/Admin
export const updateSize = async (req, res) => {
  try {
    const { size, mainType, description } = req.body;

    let sizeDoc = await Size.findById(req.params.id);
    if (!sizeDoc) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    sizeDoc = await Size.findByIdAndUpdate(
      req.params.id,
      { size, mainType, description },
      { new: true, runValidators: true }
    ).populate('mainType', 'name displayName');

    res.status(200).json({
      success: true,
      size: sizeDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating size',
      error: error.message
    });
  }
};

// @desc    Delete size
// @route   DELETE /api/size/:id
// @access  Private/Admin
export const deleteSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    await Size.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Size deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting size',
      error: error.message
    });
  }
};
