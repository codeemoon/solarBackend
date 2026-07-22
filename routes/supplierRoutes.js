const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require('../controllers/supplierController');

router.post('/', protect, checkPermission("Suppliers", "create"), createSupplier);
router.get('/', protect, checkPermission("Suppliers", "read"), getSuppliers);
router.get('/:id', protect, checkPermission("Suppliers", "read"), getSupplierById);
router.put('/:id', protect, checkPermission("Suppliers", "update"), updateSupplier);
router.delete('/:id', protect, checkPermission("Suppliers", "delete"), deleteSupplier);

module.exports = router;