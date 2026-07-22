const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createFutureSale, getFutureSales, getFutureSaleById, updateFutureSale, deleteFutureSale } = require('../controllers/futureSaleController');

router.post('/', protect, checkPermission("Future Sales", "create"), createFutureSale);
router.get('/', protect, checkPermission("Future Sales", "read"), getFutureSales);
router.get('/:id', protect, checkPermission("Future Sales", "read"), getFutureSaleById);
router.put('/:id', protect, checkPermission("Future Sales", "update"), updateFutureSale);
router.delete('/:id', protect, checkPermission("Future Sales", "delete"), deleteFutureSale);

module.exports = router;