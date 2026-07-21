const express = require('express');
const router = express.Router();

const { createBank, getBanks, getBankById, updateBank, deleteBank } = require('../controllers/bankController');

router.post('/', createBank);
router.get('/', getBanks);
router.get('/:id', getBankById);
router.put('/:id', updateBank);
router.delete('/:id', deleteBank);

module.exports = router;