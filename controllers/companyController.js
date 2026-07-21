const Company = require('../models/Company');

const createCompany = async (req, res) => {
  try {
    const { name, email, phone, address, gstNumber, status } = req.body;

    const company = new Company({
      name,
      email,
      phone,
      address,
      gstNumber,
      status
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Company with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Company.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: companies,
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

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, email, phone, address, gstNumber, status } = req.body;
    
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, gstNumber, status },
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
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Company with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    await company.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };