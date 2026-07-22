const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.post('/', protect, checkPermission("Categories", "create"), createCategory);
router.get('/', protect, checkPermission("Categories", "read"), getCategories);
router.get('/:id', protect, checkPermission("Categories", "read"), getCategoryById);
router.put('/:id', protect, checkPermission("Categories", "update"), updateCategory);
router.delete('/:id', protect, checkPermission("Categories", "delete"), deleteCategory);

module.exports = router;