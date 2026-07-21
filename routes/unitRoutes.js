const express = require('express');
const router = express.Router();

const { createUnit, getUnits, getUnitById, updateUnit, deleteUnit } = require('../controllers/unitController');

router.post('/', createUnit);
router.get('/', getUnits);
router.get('/:id', getUnitById);
router.put('/:id', updateUnit);
router.delete('/:id', deleteUnit);

module.exports = router;