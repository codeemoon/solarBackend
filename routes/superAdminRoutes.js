const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getAdminDashboard, getAllTenants, toggleTenantStatus, renewSubscription } = require('../controllers/superAdminController');

const isSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.isSuperAdmin) {
    return res.status(403).json({ success: false, message: "Access Denied: Not a Super Admin" });
  }
  next();
};

router.get('/dashboard', protect, isSuperAdmin, getAdminDashboard);
router.get('/tenants', protect, isSuperAdmin, getAllTenants);
router.put('/tenants/:id/status', protect, isSuperAdmin, toggleTenantStatus);
router.put('/tenants/:id/renew', protect, isSuperAdmin, renewSubscription);

module.exports = router;
