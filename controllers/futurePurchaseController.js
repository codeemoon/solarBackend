const FuturePurchase = require('../models/FuturePurchase');
const FuturePurchaseDetail = require('../models/FuturePurchaseDetail');

const createFuturePurchase = async (req, res) => {
  try {
    const { fpNumber, supplierId, orderDate, expectedDate, notes, status, items } = req.body;

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

    const fp = new FuturePurchase({
      fpNumber,
      supplierId,
      orderDate,
      expectedDate,
      subtotal,
      cgst: totalCgst,
      sgst: totalSgst,
      igst: totalIgst,
      totalAmount,
      status: status || 'pending',
      notes,
      companyId: req.user.companyId
    });

    await fp.save();

    const details = items.map(item => ({
      futurePurchaseId: fp._id,
      itemId: item.itemId,
      quantity: item.quantity,
      rate: item.rate,
      unitId: item.unitId,
      gstRate: item.gstRate,
      cgstAmount: (item.gstRate / 2) * item.quantity * item.rate / 100,
      sgstAmount: (item.gstRate / 2) * item.quantity * item.rate / 100,
      igstAmount: 0,
      totalAmount: item.quantity * item.rate + (item.gstRate / 2) * item.quantity * item.rate / 100 + (item.gstRate / 2) * item.quantity * item.rate / 100,
      companyId: req.user.companyId
    }));

    await FuturePurchaseDetail.insertMany(details);

    const savedFp = await FuturePurchase.findOne({ _id: fp._id, companyId: req.user.companyId }).select('-__v');

    res.status(201).json({
      success: true,
      message: 'Future Purchase created successfully',
      data: savedFp
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Future Purchase with this number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFuturePurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = { companyId: req.user.companyId };
    if (search) {
      filter.fpNumber = { $regex: search, $options: 'i' };
    }

    const fps = await FuturePurchase.find(filter)
      .populate('supplierId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await FuturePurchase.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: fps,
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

const getFuturePurchaseById = async (req, res) => {
  try {
    const fp = await FuturePurchase.findOne({ _id: req.params.id, companyId: req.user.companyId }).populate('supplierId');
    
    if (!fp) {
      return res.status(404).json({
        success: false,
        message: 'Future Purchase not found'
      });
    }

    const details = await FuturePurchaseDetail.find({ futurePurchaseId: req.params.id, companyId: req.user.companyId })
      .populate('itemId')
      .populate('unitId');

    res.status(200).json({
      success: true,
      data: {
        futurePurchase: fp,
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

const updateFuturePurchase = async (req, res) => {
  try {
    const { supplierId, orderDate, expectedDate, notes, status } = req.body;
    
    const fp = await FuturePurchase.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { supplierId, orderDate, expectedDate, notes, status },
      { new: true, runValidators: true }
    ).populate('supplierId');
    
    if (!fp) {
      return res.status(404).json({
        success: false,
        message: 'Future Purchase not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Future Purchase updated successfully',
      data: fp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteFuturePurchase = async (req, res) => {
  try {
    const fp = await FuturePurchase.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    
    if (!fp) {
      return res.status(404).json({
        success: false,
        message: 'Future Purchase not found'
      });
    }
    
    await FuturePurchaseDetail.deleteMany({ futurePurchaseId: req.params.id, companyId: req.user.companyId });
    
    res.status(200).json({
      success: true,
      message: 'Future Purchase deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createFuturePurchase, getFuturePurchases, getFuturePurchaseById, updateFuturePurchase, deleteFuturePurchase };