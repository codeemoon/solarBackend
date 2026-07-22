const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createUnit, getUnits, getUnitById, updateUnit, deleteUnit } = require('../controllers/unitController');

router.post('/', protect, checkPermission("Units", "create"), createUnit);
router.get('/', protect, checkPermission("Units", "read"), getUnits);
router.get('/:id', protect, checkPermission("Units", "read"), getUnitById);
router.put('/:id', protect, checkPermission("Units", "update"), updateUnit);
router.delete('/:id', protect, checkPermission("Units", "delete"), deleteUnit);

module.exports = router;