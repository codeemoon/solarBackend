const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createPurchase, getPurchases, getPurchaseById, updatePurchase, deletePurchase } = require('../controllers/purchaseController');

router.post('/', protect, checkPermission("Purchases", "create"), createPurchase);
router.get('/', protect, checkPermission("Purchases", "read"), getPurchases);
router.get('/:id', protect, checkPermission("Purchases", "read"), getPurchaseById);
router.put('/:id', protect, checkPermission("Purchases", "update"), updatePurchase);
router.delete('/:id', protect, checkPermission("Purchases", "delete"), deletePurchase);

module.exports = router;