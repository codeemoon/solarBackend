const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const { attachCompany } = require('../middleware/tenantMiddleware');

const { createReceipt, getReceipts, getReceiptById, updateReceipt, deleteReceipt } = require('../controllers/receiptController');

router.post('/', protect, checkPermission("Receipts", "create"), attachCompany, createReceipt);
router.get('/', protect, checkPermission("Receipts", "read"), getReceipts);
router.get('/:id', protect, checkPermission("Receipts", "read"), getReceiptById);
router.put('/:id', protect, checkPermission("Receipts", "update"), attachCompany, updateReceipt);
router.delete('/:id', protect, checkPermission("Receipts", "delete"), deleteReceipt);

module.exports = router;