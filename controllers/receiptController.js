const Receipt = require('../models/Receipt');

const createReceipt = async (req, res) => {
  try {
    const { voucherNumber, customerId, amount, date, mode, bankId, referenceNo, saleId, notes } = req.body;

    const receipt = new Receipt({
      voucherNumber,
      customerId,
      amount,
      date,
      mode,
      bankId,
      referenceNo,
      saleId,
      notes
    });

    await receipt.save();

    const savedReceipt = await Receipt.findById(receipt._id).populate('customerId bankId saleId').select('-__v');

    res.status(201).json({
      success: true,
      message: 'Receipt created successfully',
      data: savedReceipt
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Receipt with this voucher number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getReceipts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      $or: [
        { voucherNumber: { $regex: search, $options: 'i' } },
        { referenceNo: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const receipts = await Receipt.find(filter)
      .populate('customerId bankId saleId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Receipt.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: receipts,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('customerId bankId saleId');
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateReceipt = async (req, res) => {
  try {
    const { customerId, amount, date, mode, bankId, referenceNo, saleId, notes } = req.body;
    
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { customerId, amount, date, mode, bankId, referenceNo, saleId, notes },
      { new: true, runValidators: true }
    ).populate('customerId bankId saleId');
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Receipt updated successfully',
      data: receipt
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Receipt with this voucher number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }
    
    await receipt.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Receipt deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createReceipt, getReceipts, getReceiptById, updateReceipt, deleteReceipt };