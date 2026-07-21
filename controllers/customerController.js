const Customer = require('../models/Customer');

const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, gstNumber, status } = req.body;

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      gstNumber,
      status
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      name: { $regex: search, $options: 'i' }
    } : {};

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Customer.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: customers,
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

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, gstNumber, status } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, gstNumber, status },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    await customer.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };