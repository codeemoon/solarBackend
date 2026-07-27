const Sale = require('../models/Sale');
const SaleDetail = require('../models/SaleDetail');

const createSale = async (req, res) => {
  try {
    const { saleNumber, customerId, date, dueDate, notes, status, items } = req.body;

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

    const sale = new Sale({
      saleNumber,
      customerId,
      date,
      dueDate,
      subtotal,
      cgst: totalCgst,
      sgst: totalSgst,
      igst: totalIgst,
      totalAmount,
      status: status || 'unpaid',
      notes,
      companyId: req.user.companyId
    });

    await sale.save();

    const saleDetails = items.map(item => ({
      saleId: sale._id,
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

    await SaleDetail.insertMany(saleDetails);

    const savedSale = await Sale.findOne({ _id: sale._id, companyId: req.user.companyId }).select('-__v');

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: savedSale
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Sale with this number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = { companyId: req.user.companyId };
    if (search) {
      filter.saleNumber = { $regex: search, $options: 'i' };
    }

    const sales = await Sale.find(filter)
      .populate('customerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Sale.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: sales,
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

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, companyId: req.user.companyId }).populate('customerId');
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    const details = await SaleDetail.find({ saleId: req.params.id, companyId: req.user.companyId })
      .populate('itemId')
      .populate('unitId');

    res.status(200).json({
      success: true,
      data: {
        sale,
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

const updateSale = async (req, res) => {
  try {
    const { customerId, date, dueDate, notes, status } = req.body;
    
    const sale = await Sale.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { customerId, date, dueDate, notes, status },
      { new: true, runValidators: true }
    ).populate('customerId');
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Sale updated successfully',
      data: sale
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }
    
    await SaleDetail.deleteMany({ saleId: req.params.id, companyId: req.user.companyId });
    
    res.status(200).json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createSale, getSales, getSaleById, updateSale, deleteSale };