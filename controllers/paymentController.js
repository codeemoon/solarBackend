const Payment = require('../models/Payment');

const createPayment = async (req, res) => {
  try {
    const { voucherNumber, supplierId, amount, date, mode, bankId, referenceNo, purchaseId, notes } = req.body;

    const payment = new Payment({
      voucherNumber,
      supplierId,
      amount,
      date,
      mode,
      bankId,
      referenceNo,
      purchaseId,
      notes
    });

    await payment.save();

    const savedPayment = await Payment.findById(payment._id).populate('supplierId bankId purchaseId').select('-__v');

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: savedPayment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Payment with this voucher number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPayments = async (req, res) => {
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

    const payments = await Payment.find(filter)
      .populate('supplierId bankId purchaseId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: payments,
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

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('supplierId bankId purchaseId');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { supplierId, amount, date, mode, bankId, referenceNo, purchaseId, notes } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { supplierId, amount, date, mode, bankId, referenceNo, purchaseId, notes },
      { new: true, runValidators: true }
    ).populate('supplierId bankId purchaseId');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Payment with this voucher number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    await payment.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createPayment, getPayments, getPaymentById, updatePayment, deletePayment };