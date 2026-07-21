const express = require('express');
const router = express.Router();

const { createGst, getGsts, getGstById, updateGst, deleteGst } = require('../controllers/gstController');

router.post('/', createGst);
router.get('/', getGsts);
router.get('/:id', getGstById);
router.put('/:id', updateGst);
router.delete('/:id', deleteGst);

module.exports = router;