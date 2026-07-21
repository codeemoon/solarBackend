const express = require('express');
const router = express.Router();

const { createReceipt, getReceipts, getReceiptById, updateReceipt, deleteReceipt } = require('../controllers/receiptController');

router.post('/', createReceipt);
router.get('/', getReceipts);
router.get('/:id', getReceiptById);
router.put('/:id', updateReceipt);
router.delete('/:id', deleteReceipt);

module.exports = router;