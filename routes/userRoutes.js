const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.post('/', protect, checkPermission("Users", "create"), createUser);
router.get('/', protect, checkPermission("Users", "read"), getUsers);
router.get('/:id', protect, checkPermission("Users", "read"), getUserById);
router.put('/:id', protect, checkPermission("Users", "update"), updateUser);
router.delete('/:id', protect, checkPermission("Users", "delete"), deleteUser);

module.exports = router;