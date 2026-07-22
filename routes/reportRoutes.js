const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { purchaseRegister, salesRegister, futurePurchaseReport, futureSalesReport, paymentRegister, receiptRegister, supplierLedger, customerLedger, outstandingPayable, outstandingReceivable, productWiseReport, brandWiseReport, gstSummary, profitMarginReport } = require('../controllers/reportController');

router.get('/purchase', protect, checkPermission("Reports", "read"), purchaseRegister);
router.get('/sales', protect, checkPermission("Reports", "read"), salesRegister);
router.get('/future-purchase', protect, checkPermission("Reports", "read"), futurePurchaseReport);
router.get('/future-sales', protect, checkPermission("Reports", "read"), futureSalesReport);
router.get('/payment', protect, checkPermission("Reports", "read"), paymentRegister);
router.get('/receipt', protect, checkPermission("Reports", "read"), receiptRegister);
router.get('/supplier-ledger', protect, checkPermission("Reports", "read"), supplierLedger);
router.get('/customer-ledger', protect, checkPermission("Reports", "read"), customerLedger);
router.get('/outstanding-payable', protect, checkPermission("Reports", "read"), outstandingPayable);
router.get('/outstanding-receivable', protect, checkPermission("Reports", "read"), outstandingReceivable);
router.get('/product-wise', protect, checkPermission("Reports", "read"), productWiseReport);
router.get('/brand-wise', protect, checkPermission("Reports", "read"), brandWiseReport);
router.get('/gst-summary', protect, checkPermission("Reports", "read"), gstSummary);
router.get('/profit-margin', protect, checkPermission("Reports", "read"), profitMarginReport);

module.exports = router;