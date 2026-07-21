const express = require('express');
const router = express.Router();

const { purchaseRegister, salesRegister, futurePurchaseReport, futureSalesReport, paymentRegister, receiptRegister, supplierLedger, customerLedger, outstandingPayable, outstandingReceivable, productWiseReport, brandWiseReport, gstSummary, profitMarginReport } = require('../controllers/reportController');

router.get('/purchase', purchaseRegister);
router.get('/sales', salesRegister);
router.get('/future-purchase', futurePurchaseReport);
router.get('/future-sales', futureSalesReport);
router.get('/payment', paymentRegister);
router.get('/receipt', receiptRegister);
router.get('/supplier-ledger', supplierLedger);
router.get('/customer-ledger', customerLedger);
router.get('/outstanding-payable', outstandingPayable);
router.get('/outstanding-receivable', outstandingReceivable);
router.get('/product-wise', productWiseReport);
router.get('/brand-wise', brandWiseReport);
router.get('/gst-summary', gstSummary);
router.get('/profit-margin', profitMarginReport);

module.exports = router;