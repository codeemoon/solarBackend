const Company = require('../models/Company');
const User = require('../models/User');

const getAdminDashboard = async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments({});
    const activeCompanies = await Company.countDocuments({ status: 'active' });
    const now = new Date();
    const expiredSubscriptions = await Company.countDocuments({ subscriptionExpiry: { $lt: now } });
    const totalUsers = await User.countDocuments({ isSuperAdmin: { $ne: true } });
    const activeUsers = await User.countDocuments({ isSuperAdmin: { $ne: true }, status: { $ne: 'inactive' } });

    res.status(200).json({
      success: true,
      data: {
        totalCompanies,
        activeCompanies,
        expiredSubscriptions,
        totalUsers,
        activeUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllTenants = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 }).lean();

    const tenants = await Promise.all(
      companies.map(async (company) => {
        const userCount = await User.countDocuments({ companyId: company._id });
        return {
          ...company,
          userCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const toggleTenantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "inactive"'
      });
    }

    const company = await Company.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Tenant status updated to ${status}`,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const renewSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.body.days) || 30;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const now = new Date();
    let currentExpiry = company.subscriptionExpiry ? new Date(company.subscriptionExpiry) : now;
    
    // If current expiry is already past, renew from today. Otherwise, extend from current expiry.
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

    company.subscriptionExpiry = newExpiry;
    await company.save();

    res.status(200).json({
      success: true,
      message: `Subscription renewed for ${days} days`,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllTenants,
  toggleTenantStatus,
  renewSubscription
};
