const express = require('express');
const router = express.Router();

const { createFuturePurchase, getFuturePurchases, getFuturePurchaseById, updateFuturePurchase, deleteFuturePurchase } = require('../controllers/futurePurchaseController');

router.post('/', createFuturePurchase);
router.get('/', getFuturePurchases);
router.get('/:id', getFuturePurchaseById);
router.put('/:id', updateFuturePurchase);
router.delete('/:id', deleteFuturePurchase);

module.exports = router;