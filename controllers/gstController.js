const Gst = require('../models/Gst');

const createGst = async (req, res) => {
  try {
    const { taxName, rate, type, status } = req.body;

    const gst = new Gst({
      taxName,
      rate,
      type,
      status
    });

    await gst.save();

    res.status(201).json({
      success: true,
      message: 'GST created successfully',
      data: gst
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'GST with this tax name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getGsts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      taxName: { $regex: search, $options: 'i' }
    } : {};

    const gsts = await Gst.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Gst.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: gsts,
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

const getGstById = async (req, res) => {
  try {
    const gst = await Gst.findById(req.params.id);
    if (!gst) {
      return res.status(404).json({
        success: false,
        message: 'GST not found'
      });
    }
    res.status(200).json({
      success: true,
      data: gst
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateGst = async (req, res) => {
  try {
    const { taxName, rate, type, status } = req.body;
    
    const gst = await Gst.findByIdAndUpdate(
      req.params.id,
      { taxName, rate, type, status },
      { new: true, runValidators: true }
    );
    
    if (!gst) {
      return res.status(404).json({
        success: false,
        message: 'GST not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'GST updated successfully',
      data: gst
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'GST with this tax name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteGst = async (req, res) => {
  try {
    const gst = await Gst.findById(req.params.id);
    if (!gst) {
      return res.status(404).json({
        success: false,
        message: 'GST not found'
      });
    }
    await gst.deleteOne();
    res.status(200).json({
      success: true,
      message: 'GST deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createGst, getGsts, getGstById, updateGst, deleteGst };