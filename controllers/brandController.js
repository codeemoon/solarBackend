const Brand = require('../models/Brand');

const createBrand = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const brand = new Brand({
      name,
      description,
      status
    });

    await brand.save();

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBrands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      name: { $regex: search, $options: 'i' }
    } : {};

    const brands = await Brand.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Brand.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: brands,
      total: totalCount,
      page: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    await brand.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createBrand, getBrands, getBrandById, updateBrand, deleteBrand };