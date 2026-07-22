const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createItem, getItems, getItemById, updateItem, deleteItem } = require('../controllers/itemController');

router.post('/', protect, checkPermission("Items", "create"), createItem);
router.get('/', protect, checkPermission("Items", "read"), getItems);
router.get('/:id', protect, checkPermission("Items", "read"), getItemById);
router.put('/:id', protect, checkPermission("Items", "update"), updateItem);
router.delete('/:id', protect, checkPermission("Items", "delete"), deleteItem);

module.exports = router;