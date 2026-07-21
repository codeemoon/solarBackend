const Purchase = require('../models/Purchase');
const Sale = require('../models/Sale');
const FuturePurchase = require('../models/FuturePurchase');
const FutureSale = require('../models/FutureSale');
const Payment = require('../models/Payment');
const Receipt = require('../models/Receipt');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const Item = require('../models/Item');
const Brand = require('../models/Brand');
const SaleDetail = require('../models/SaleDetail');

const purchaseRegister = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const purchases = await Purchase.find(filter)
      .populate('supplierId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: purchases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const salesRegister = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const sales = await Sale.find(filter)
      .populate('customerId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: sales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const futurePurchaseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) filter.orderDate.$gte = new Date(startDate);
      if (endDate) filter.orderDate.$lte = new Date(endDate);
    }

    const futurePurchases = await FuturePurchase.find(filter)
      .populate('supplierId')
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: futurePurchases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const futureSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) filter.orderDate.$gte = new Date(startDate);
      if (endDate) filter.orderDate.$lte = new Date(endDate);
    }

    const futureSales = await FutureSale.find(filter)
      .populate('customerId')
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: futureSales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const paymentRegister = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .populate('supplierId')
      .populate('bankId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const receiptRegister = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const receipts = await Receipt.find(filter)
      .populate('customerId')
      .populate('bankId')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: receipts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const supplierLedger = async (req, res) => {
  try {
    const { supplierId, startDate, endDate } = req.query;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: 'supplierId is required'
      });
    }

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const [purchases, payments] = await Promise.all([
      Purchase.find({ supplierId, ...dateFilter })
        .populate('supplierId')
        .sort({ date: 1 }),
      Payment.find({ supplierId, ...dateFilter })
        .populate('supplierId')
        .populate('bankId')
        .sort({ date: 1 })
    ]);

    const transactions = [];

    for (const p of purchases) {
      transactions.push({
        date: p.date,
        type: 'purchase',
        reference: p.purchaseNumber,
        description: `Purchase from ${p.supplierId?.name || 'Unknown'}`,
        debit: p.totalAmount,
        credit: 0
      });
    }

    for (const p of payments) {
      transactions.push({
        date: p.date,
        type: 'payment',
        reference: p.voucherNumber,
        description: `Payment via ${p.mode}`,
        debit: 0,
        credit: p.amount
      });
    }

    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBalance = 0;
    const ledger = transactions.map(t => {
      runningBalance += t.debit - t.credit;
      return {
        ...t,
        balance: runningBalance
      };
    });

    const closingBalance = runningBalance;

    res.status(200).json({
      success: true,
      data: ledger,
      closingBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const customerLedger = async (req, res) => {
  try {
    const { customerId, startDate, endDate } = req.query;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'customerId is required'
      });
    }

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const [sales, receipts] = await Promise.all([
      Sale.find({ customerId, ...dateFilter })
        .populate('customerId')
        .sort({ date: 1 }),
      Receipt.find({ customerId, ...dateFilter })
        .populate('customerId')
        .populate('bankId')
        .sort({ date: 1 })
    ]);

    const transactions = [];

    for (const s of sales) {
      transactions.push({
        date: s.date,
        type: 'sale',
        reference: s.saleNumber,
        description: `Sale to ${s.customerId?.name || 'Unknown'}`,
        credit: s.totalAmount,
        debit: 0
      });
    }

    for (const r of receipts) {
      transactions.push({
        date: r.date,
        type: 'receipt',
        reference: r.voucherNumber,
        description: `Receipt via ${r.mode}`,
        credit: 0,
        debit: r.amount
      });
    }

    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBalance = 0;
    const ledger = transactions.map(t => {
      runningBalance += t.credit - t.debit;
      return {
        ...t,
        balance: runningBalance
      };
    });

    const closingBalance = runningBalance;

    res.status(200).json({
      success: true,
      data: ledger,
      closingBalance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const outstandingPayable = async (req, res) => {
  try {
    const [suppliers, purchasesAgg, paymentsAgg] = await Promise.all([
      Supplier.find().select('name'),
      Purchase.aggregate([
        { $group: { _id: '$supplierId', totalPurchased: { $sum: '$totalAmount' } } }
      ]),
      Payment.aggregate([
        { $group: { _id: '$supplierId', totalPaid: { $sum: '$amount' } } }
      ])
    ]);

    const purchaseMap = {};
    purchasesAgg.forEach(p => { purchaseMap[p._id.toString()] = p.totalPurchased; });

    const paymentMap = {};
    paymentsAgg.forEach(p => { paymentMap[p._id.toString()] = p.totalPaid; });

    const result = suppliers
      .map(s => {
        const totalPurchased = purchaseMap[s._id.toString()] || 0;
        const totalPaid = paymentMap[s._id.toString()] || 0;
        const outstanding = totalPurchased - totalPaid;
        return outstanding > 0 ? {
          supplierId: s._id,
          supplierName: s.name,
          totalPurchased,
          totalPaid,
          outstanding
        } : null;
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const outstandingReceivable = async (req, res) => {
  try {
    const [customers, salesAgg, receiptsAgg] = await Promise.all([
      Customer.find().select('name'),
      Sale.aggregate([
        { $group: { _id: '$customerId', totalSold: { $sum: '$totalAmount' } } }
      ]),
      Receipt.aggregate([
        { $group: { _id: '$customerId', totalReceived: { $sum: '$amount' } } }
      ])
    ]);

    const salesMap = {};
    salesAgg.forEach(s => { salesMap[s._id.toString()] = s.totalSold; });

    const receiptMap = {};
    receiptsAgg.forEach(r => { receiptMap[r._id.toString()] = r.totalReceived; });

    const result = customers
      .map(c => {
        const totalSold = salesMap[c._id.toString()] || 0;
        const totalReceived = receiptMap[c._id.toString()] || 0;
        const outstanding = totalSold - totalReceived;
        return outstanding > 0 ? {
          customerId: c._id,
          customerName: c.name,
          totalSold,
          totalReceived,
          outstanding
        } : null;
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const productWiseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const sales = await Sale.find(dateFilter).select('_id').lean();
    const saleIds = sales.map(s => s._id);

    const saleDetails = await SaleDetail.find({ saleId: { $in: saleIds } })
      .populate({
        path: 'itemId',
        select: 'name',
        populate: {
          path: 'brandId',
          select: 'name'
        }
      })
      .lean();

    const productMap = {};

    for (const sd of saleDetails) {
      if (!sd.itemId) continue;
      const itemId = sd.itemId._id.toString();
      const itemName = sd.itemId.name || 'Unknown';
      const brandName = sd.itemId.brandId?.name || 'Unknown';
      const qty = sd.quantity || 0;
      const amount = sd.totalAmount || 0;

      if (!productMap[itemId]) {
        productMap[itemId] = {
          itemId,
          name: itemName,
          brand: brandName,
          totalQuantity: 0,
          totalAmount: 0
        };
      }
      productMap[itemId].totalQuantity += qty;
      productMap[itemId].totalAmount += amount;
    }

    const result = Object.values(productMap)
      .sort((a, b) => b.totalAmount - a.totalAmount);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const brandWiseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const sales = await Sale.find(dateFilter).select('_id').lean();
    const saleIds = sales.map(s => s._id);

    const saleDetails = await SaleDetail.find({ saleId: { $in: saleIds } })
      .populate({
        path: 'itemId',
        select: 'name',
        populate: {
          path: 'brandId',
          select: 'name'
        }
      })
      .lean();

    const brandMap = {};

    for (const sd of saleDetails) {
      if (!sd.itemId || !sd.itemId.brandId) continue;
      const brandId = sd.itemId.brandId._id.toString();
      const brandName = sd.itemId.brandId.name || 'Unknown';
      const qty = sd.quantity || 0;
      const amount = sd.totalAmount || 0;

      if (!brandMap[brandId]) {
        brandMap[brandId] = {
          brandId,
          brandName,
          totalQuantity: 0,
          totalAmount: 0
        };
      }
      brandMap[brandId].totalQuantity += qty;
      brandMap[brandId].totalAmount += amount;
    }

    const result = Object.values(brandMap)
      .sort((a, b) => b.totalAmount - a.totalAmount);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const gstSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const agg = await Sale.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalCgst: { $sum: '$cgst' },
          totalSgst: { $sum: '$sgst' },
          totalIgst: { $sum: '$igst' }
        }
      }
    ]);

    const result = agg[0] || { totalCgst: 0, totalSgst: 0, totalIgst: 0 };
    const totalGST = result.totalCgst + result.totalSgst + result.totalIgst;

    res.status(200).json({
      success: true,
      data: {
        totalCgst: result.totalCgst,
        totalSgst: result.totalSgst,
        totalIgst: result.totalIgst,
        totalGST
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const profitMarginReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    const sales = await Sale.find(dateFilter).select('_id').lean();
    const saleIds = sales.map(s => s._id);

    const saleDetails = await SaleDetail.find({ saleId: { $in: saleIds } })
      .populate({
        path: 'itemId',
        select: 'name purchasePrice'
      })
      .lean();

    const itemMap = {};

    for (const sd of saleDetails) {
      if (!sd.itemId) continue;
      const itemId = sd.itemId._id.toString();
      const itemName = sd.itemId.name || 'Unknown';
      const purchasePrice = sd.itemId.purchasePrice || 0;
      const qty = sd.quantity || 0;
      const amount = sd.totalAmount || 0;

      if (!itemMap[itemId]) {
        itemMap[itemId] = {
          itemId,
          name: itemName,
          purchasePrice,
          totalQuantity: 0,
          totalSaleAmount: 0
        };
      }
      itemMap[itemId].totalQuantity += qty;
      itemMap[itemId].totalSaleAmount += amount;
    }

    const result = Object.values(itemMap).map(item => {
      const totalCost = item.totalQuantity * item.purchasePrice;
      const profit = item.totalSaleAmount - totalCost;
      const margin = item.totalSaleAmount > 0 ? ((profit / item.totalSaleAmount) * 100) : 0;
      return {
        itemId: item.itemId,
        name: item.name,
        totalQuantity: item.totalQuantity,
        totalSaleAmount: item.totalSaleAmount,
        totalCost,
        profit,
        margin: parseFloat(margin.toFixed(2))
      };
    }).sort((a, b) => b.profit - a.profit);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { purchaseRegister, salesRegister, futurePurchaseReport, futureSalesReport, paymentRegister, receiptRegister, supplierLedger, customerLedger, outstandingPayable, outstandingReceivable, productWiseReport, brandWiseReport, gstSummary, profitMarginReport };