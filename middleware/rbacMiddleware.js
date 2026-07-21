const Role = require('../models/Role');

const checkPermission = (module, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.roleId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: No role assigned'
        });
      }

      const role = await Role.findById(req.user.roleId);
      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Role not found'
        });
      }

      const hasPermission = role.permissions.some(
        perm => perm.module === module && perm.actions.includes(action)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

module.exports = { checkPermission };