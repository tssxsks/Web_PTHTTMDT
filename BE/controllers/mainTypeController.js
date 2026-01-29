import MainType from '../models/mainTypeModel.js';

// @desc    Get all main types
// @route   GET /api/maintype
// @access  Public
export const getAllMainTypes = async (req, res) => {
  try {
    const mainTypes = await MainType.find();
    res.status(200).json({
      success: true,
      mainTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching main types',
      error: error.message
    });
  }
};

// @desc    Get single main type
// @route   GET /api/maintype/:id
// @access  Public
export const getSingleMainType = async (req, res) => {
  try {
    const mainType = await MainType.findById(req.params.id);
    if (!mainType) {
      return res.status(404).json({
        success: false,
        message: 'Main type not found'
      });
    }
    res.status(200).json({
      success: true,
      mainType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching main type',
      error: error.message
    });
  }
};

// @desc    Add a main type
// @route   POST /api/maintype
// @access  Private/Admin
export const addMainType = async (req, res) => {
  try {
    const { name, displayName, description } = req.body;

    if (!name || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and display name'
      });
    }

    const mainType = await MainType.create({
      name,
      displayName,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      mainType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding main type',
      error: error.message
    });
  }
};

// @desc    Update main type
// @route   PUT /api/maintype/:id
// @access  Private/Admin
export const updateMainType = async (req, res) => {
  try {
    const { name, displayName, description } = req.body;

    let mainType = await MainType.findById(req.params.id);
    if (!mainType) {
      return res.status(404).json({
        success: false,
        message: 'Main type not found'
      });
    }

    mainType = await MainType.findByIdAndUpdate(
      req.params.id,
      { name, displayName, description },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      mainType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating main type',
      error: error.message
    });
  }
};

// @desc    Delete main type
// @route   DELETE /api/maintype/:id
// @access  Private/Admin
export const deleteMainType = async (req, res) => {
  try {
    const mainType = await MainType.findByIdAndDelete(req.params.id);

    if (!mainType) {
      return res.status(404).json({
        success: false,
        message: 'Main type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Main type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting main type',
      error: error.message
    });
  }
};
