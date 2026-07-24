const User = require('../models/User');
const Company = require('../models/Company');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('roleId');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id, roleId: user.roleId?._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const userData = await User.findById(user._id).select('-password').populate('roleId');

    res.status(200).json({
      success: true,
      token,
      data: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const checkSetup = async (req, res) => {
  try {
    const count = await User.countDocuments({});
    res.status(200).json({
      success: true,
      isSetupDone: count > 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const setupAdmin = async (req, res) => {
  try {
    const count = await User.countDocuments({});
    if (count > 0) {
      return res.status(403).json({
        success: false,
        message: 'Setup already completed'
      });
    }

    const { companyName, name, email, password } = req.body;

    // Create Company
    const company = await Company.create({
      name: companyName,
      email: email,
      status: 'active'
    });

    // Create Super Admin Role with full permissions for all modules
    const modules = [
      "Companies", "Brands", "Units", "Suppliers", "Customers",
      "Banks", "GST", "Categories", "Items", "Roles",
      "Users", "Purchases", "Future Purchases", "Sales",
      "Future Sales", "Payments", "Receipts"
    ];

    const permissions = modules.map(module => ({
      module,
      actions: ["create", "read", "update", "delete"]
    }));

    const role = await Role.create({
      name: "Super Admin",
      description: "Full access to everything",
      permissions,
      status: "active"
    });

    // Hash password and create user via insertMany to avoid double-hashing from pre-save hook
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const users = await User.insertMany([{
      name,
      email,
      username: email,
      password: hashedPassword,
      companyId: company._id,
      roleId: role._id,
      status: "active"
    }]);

    const createdUser = users[0];

    const token = jwt.sign(
      { userId: createdUser._id, roleId: role._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    const userData = await User.findById(createdUser._id).select('-password').populate('roleId');

    res.status(201).json({
      success: true,
      message: 'Setup complete',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { login, checkSetup, setupAdmin };