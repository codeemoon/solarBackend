const Role = require('../models/Role');

const createRole = async (req, res) => {
  try {
    const { name, description, permissions, status } = req.body;

    const role = new Role({
      name,
      description,
      permissions,
      status
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      name: { $regex: search, $options: 'i' }
    } : {};

    const roles = await Role.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Role.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: roles,
      total: totalCount,
      page: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description, permissions, status } = req.body;
    
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description, permissions, status },
      { new: true, runValidators: true }
    );
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    await role.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole };