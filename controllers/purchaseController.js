const Purchase = require('../models/Purchase');
const PurchaseDetail = require('../models/PurchaseDetail');

const createPurchase = async (req, res) => {
  try {
    const { purchaseNumber, supplierId, date, dueDate, notes, status, items } = req.body;

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

    const purchase = new Purchase({
      purchaseNumber,
      supplierId,
      date,
      dueDate,
      subtotal,
      cgst: totalCgst,
      sgst: totalSgst,
      igst: totalIgst,
      totalAmount,
      status: status || 'pending',
      notes,
      companyId: req.user.companyId
    });

    await purchase.save();

    const purchaseDetails = items.map(item => ({
      purchaseId: purchase._id,
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

    await PurchaseDetail.insertMany(purchaseDetails);

    const savedPurchase = await Purchase.findOne({ _id: purchase._id, companyId: req.user.companyId }).select('-__v');

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: savedPurchase
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Purchase with this number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPurchases = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = { companyId: req.user.companyId };
    if (search) {
      filter.purchaseNumber = { $regex: search, $options: 'i' };
    }

    const purchases = await Purchase.find(filter)
      .populate('supplierId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Purchase.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: purchases,
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

const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, companyId: req.user.companyId }).populate('supplierId');
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    const details = await PurchaseDetail.find({ purchaseId: req.params.id, companyId: req.user.companyId })
      .populate('itemId')
      .populate('unitId');

    res.status(200).json({
      success: true,
      data: {
        purchase,
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

const updatePurchase = async (req, res) => {
  try {
    const { supplierId, date, dueDate, notes, status } = req.body;
    
    const purchase = await Purchase.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { supplierId, date, dueDate, notes, status },
      { new: true, runValidators: true }
    ).populate('supplierId');
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Purchase updated successfully',
      data: purchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }
    
    await PurchaseDetail.deleteMany({ purchaseId: req.params.id, companyId: req.user.companyId });
    
    res.status(200).json({
      success: true,
      message: 'Purchase deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createPurchase, getPurchases, getPurchaseById, updatePurchase, deletePurchase };