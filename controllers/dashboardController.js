const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Receipt = require('../models/Receipt');
const Payment = require('../models/Payment');

const getDashboardSummary = async (req, res) => {
  try {
    const [salesAgg, purchaseAgg, receiptAgg, paymentAgg] = await Promise.all([
      Sale.aggregate([
        { $group: { _id: null, totalSalesAmount: { $sum: '$totalAmount' }, totalSalesCount: { $sum: 1 } } }
      ]),
      Purchase.aggregate([
        { $group: { _id: null, totalPurchaseAmount: { $sum: '$totalAmount' }, totalPurchaseCount: { $sum: 1 } } }
      ]),
      Receipt.aggregate([
        { $group: { _id: null, totalReceiptAmount: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $group: { _id: null, totalPaymentAmount: { $sum: '$amount' } } }
      ])
    ]);

    const data = {
      sales: {
        totalSalesAmount: salesAgg[0]?.totalSalesAmount || 0,
        totalSalesCount: salesAgg[0]?.totalSalesCount || 0
      },
      purchases: {
        totalPurchaseAmount: purchaseAgg[0]?.totalPurchaseAmount || 0,
        totalPurchaseCount: purchaseAgg[0]?.totalPurchaseCount || 0
      },
      receipts: {
        totalReceiptAmount: receiptAgg[0]?.totalReceiptAmount || 0
      },
      payments: {
        totalPaymentAmount: paymentAgg[0]?.totalPaymentAmount || 0
      }
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getDashboardSummary };