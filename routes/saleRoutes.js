const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const { attachCompany } = require('../middleware/tenantMiddleware');

const { createSale, getSales, getSaleById, updateSale, deleteSale } = require('../controllers/saleController');

router.post('/', protect, checkPermission("Sales", "create"), attachCompany, createSale);
router.get('/', protect, checkPermission("Sales", "read"), getSales);
router.get('/:id', protect, checkPermission("Sales", "read"), getSaleById);
router.put('/:id', protect, checkPermission("Sales", "update"), attachCompany, updateSale);
router.delete('/:id', protect, checkPermission("Sales", "delete"), deleteSale);

module.exports = router;