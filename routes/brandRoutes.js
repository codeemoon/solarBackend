const express = require('express');
const router = express.Router();

const { createBrand, getBrands, getBrandById, updateBrand, deleteBrand } = require('../controllers/brandController');

router.post('/', createBrand);
router.get('/', getBrands);
router.get('/:id', getBrandById);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;