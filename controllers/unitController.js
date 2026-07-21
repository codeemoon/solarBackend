const Unit = require('../models/Unit');

const createUnit = async (req, res) => {
  try {
    const { name, status } = req.body;

    const unit = new Unit({
      name,
      status
    });

    await unit.save();

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: unit
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Unit with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUnits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      name: { $regex: search, $options: 'i' }
    } : {};

    const units = await Unit.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Unit.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: units,
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

const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }
    res.status(200).json({
      success: true,
      data: unit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUnit = async (req, res) => {
  try {
    const { name, status } = req.body;
    
    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { name, status },
      { new: true, runValidators: true }
    );
    
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Unit updated successfully',
      data: unit
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Unit with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }
    await unit.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createUnit, getUnits, getUnitById, updateUnit, deleteUnit };