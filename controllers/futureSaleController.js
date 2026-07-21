const FutureSale = require('../models/FutureSale');
const FutureSaleDetail = require('../models/FutureSaleDetail');

const createFutureSale = async (req, res) => {
  try {
    const { fsNumber, customerId, orderDate, expectedDate, notes, status, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    for (const item of items) {
      const { quantity, rate, gstRate } = item;
      const cgstAmount = (gstRate / 2) * quantity * rate / 100;
      const sgstAmount = (gstRate / 2) * quantity * rate / 100;
      const igstAmount = 0;

      subtotal += quantity * rate;
      totalCgst += cgstAmount;
      totalSgst += sgstAmount;
      totalIgst += igstAmount;
    }

    const totalAmount = subtotal + totalCgst + totalSgst + totalIgst;

    const fs = new FutureSale({
      fsNumber,
      customerId,
      orderDate,
      expectedDate,
      subtotal,
      cgst: totalCgst,
      sgst: totalSgst,
      igst: totalIgst,
      totalAmount,
      status: status || 'pending',
      notes
    });

    await fs.save();

    const details = items.map(item => ({
      futureSaleId: fs._id,
      itemId: item.itemId,
      quantity: item.quantity,
      rate: item.rate,
      unitId: item.unitId,
      gstRate: item.gstRate,
      cgstAmount: (item.gstRate / 2) * item.quantity * item.rate / 100,
      sgstAmount: (item.gstRate / 2) * item.quantity * item.rate / 100,
      igstAmount: 0,
      totalAmount: item.quantity * item.rate + (item.gstRate / 2) * item.quantity * item.rate / 100 + (item.gstRate / 2) * item.quantity * item.rate / 100
    }));

    await FutureSaleDetail.insertMany(details);

    const savedFs = await FutureSale.findById(fs._id).select('-__v');

    res.status(201).json({
      success: true,
      message: 'Future Sale created successfully',
      data: savedFs
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Future Sale with this number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFutureSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      fsNumber: { $regex: search, $options: 'i' }
    } : {};

    const fss = await FutureSale.find(filter)
      .populate('customerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await FutureSale.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: fss,
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

const getFutureSaleById = async (req, res) => {
  try {
    const fs = await FutureSale.findById(req.params.id).populate('customerId');
    
    if (!fs) {
      return res.status(404).json({
        success: false,
        message: 'Future Sale not found'
      });
    }

    const details = await FutureSaleDetail.find({ futureSaleId: req.params.id })
      .populate('itemId')
      .populate('unitId');

    res.status(200).json({
      success: true,
      data: {
        futureSale: fs,
        items: details
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateFutureSale = async (req, res) => {
  try {
    const { customerId, orderDate, expectedDate, notes, status } = req.body;
    
    const fs = await FutureSale.findByIdAndUpdate(
      req.params.id,
      { customerId, orderDate, expectedDate, notes, status },
      { new: true, runValidators: true }
    ).populate('customerId');
    
    if (!fs) {
      return res.status(404).json({
        success: false,
        message: 'Future Sale not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Future Sale updated successfully',
      data: fs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteFutureSale = async (req, res) => {
  try {
    const fs = await FutureSale.findById(req.params.id);
    
    if (!fs) {
      return res.status(404).json({
        success: false,
        message: 'Future Sale not found'
      });
    }
    
    await FutureSaleDetail.deleteMany({ futureSaleId: req.params.id });
    await fs.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Future Sale deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createFutureSale, getFutureSales, getFutureSaleById, updateFutureSale, deleteFutureSale };