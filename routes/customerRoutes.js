const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');

router.post('/', protect, checkPermission("Customers", "create"), createCustomer);
router.get('/', protect, checkPermission("Customers", "read"), getCustomers);
router.get('/:id', protect, checkPermission("Customers", "read"), getCustomerById);
router.put('/:id', protect, checkPermission("Customers", "update"), updateCustomer);
router.delete('/:id', protect, checkPermission("Customers", "delete"), deleteCustomer);

module.exports = router;