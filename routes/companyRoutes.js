const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');

const { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = require('../controllers/companyController');

router.post('/', protect, checkPermission("Companies", "create"), createCompany);
router.get('/', protect, checkPermission("Companies", "read"), getCompanies);
router.get('/:id', protect, checkPermission("Companies", "read"), getCompanyById);
router.put('/:id', protect, checkPermission("Companies", "update"), updateCompany);
router.delete('/:id', protect, checkPermission("Companies", "delete"), deleteCompany);

module.exports = router;