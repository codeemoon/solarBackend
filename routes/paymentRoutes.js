const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createPayment, getPayments, getPaymentById, updatePayment, deletePayment } = require('../controllers/paymentController');

router.post('/', protect, checkPermission("Payments", "create"), createPayment);
router.get('/', protect, checkPermission("Payments", "read"), getPayments);
router.get('/:id', protect, checkPermission("Payments", "read"), getPaymentById);
router.put('/:id', protect, checkPermission("Payments", "update"), updatePayment);
router.delete('/:id', protect, checkPermission("Payments", "delete"), deletePayment);

module.exports = router;