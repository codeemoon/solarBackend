const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createBank, getBanks, getBankById, updateBank, deleteBank } = require('../controllers/bankController');

router.post('/', protect, checkPermission("Banks", "create"), createBank);
router.get('/', protect, checkPermission("Banks", "read"), getBanks);
router.get('/:id', protect, checkPermission("Banks", "read"), getBankById);
router.put('/:id', protect, checkPermission("Banks", "update"), updateBank);
router.delete('/:id', protect, checkPermission("Banks", "delete"), deleteBank);

module.exports = router;