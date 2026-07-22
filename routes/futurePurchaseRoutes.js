const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createFuturePurchase, getFuturePurchases, getFuturePurchaseById, updateFuturePurchase, deleteFuturePurchase } = require('../controllers/futurePurchaseController');

router.post('/', protect, checkPermission("Future Purchases", "create"), createFuturePurchase);
router.get('/', protect, checkPermission("Future Purchases", "read"), getFuturePurchases);
router.get('/:id', protect, checkPermission("Future Purchases", "read"), getFuturePurchaseById);
router.put('/:id', protect, checkPermission("Future Purchases", "update"), updateFuturePurchase);
router.delete('/:id', protect, checkPermission("Future Purchases", "delete"), deleteFuturePurchase);

module.exports = router;