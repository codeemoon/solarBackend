const express = require('express');
const router = express.Router();

const { createFutureSale, getFutureSales, getFutureSaleById, updateFutureSale, deleteFutureSale } = require('../controllers/futureSaleController');

router.post('/', createFutureSale);
router.get('/', getFutureSales);
router.get('/:id', getFutureSaleById);
router.put('/:id', updateFutureSale);
router.delete('/:id', deleteFutureSale);

module.exports = router;