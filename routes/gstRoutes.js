const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createGst, getGsts, getGstById, updateGst, deleteGst } = require('../controllers/gstController');

router.post('/', protect, checkPermission("GST", "create"), createGst);
router.get('/', protect, checkPermission("GST", "read"), getGsts);
router.get('/:id', protect, checkPermission("GST", "read"), getGstById);
router.put('/:id', protect, checkPermission("GST", "update"), updateGst);
router.delete('/:id', protect, checkPermission("GST", "delete"), deleteGst);

module.exports = router;