const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createBrand, getBrands, getBrandById, updateBrand, deleteBrand } = require('../controllers/brandController');

router.post('/', protect, checkPermission("Brands", "create"), createBrand);
router.get('/', protect, checkPermission("Brands", "read"), getBrands);
router.get('/:id', protect, checkPermission("Brands", "read"), getBrandById);
router.put('/:id', protect, checkPermission("Brands", "update"), updateBrand);
router.delete('/:id', protect, checkPermission("Brands", "delete"), deleteBrand);

module.exports = router;