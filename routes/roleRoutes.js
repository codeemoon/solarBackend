const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createRole, getRoles, getRoleById, updateRole, deleteRole } = require('../controllers/roleController');

router.post('/', protect, checkPermission("Roles", "create"), createRole);
router.get('/', protect, checkPermission("Roles", "read"), getRoles);
router.get('/:id', protect, checkPermission("Roles", "read"), getRoleById);
router.put('/:id', protect, checkPermission("Roles", "update"), updateRole);
router.delete('/:id', protect, checkPermission("Roles", "delete"), deleteRole);

module.exports = router;