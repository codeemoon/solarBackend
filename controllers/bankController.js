const Bank = require('../models/Bank');

const createBank = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder, ifscCode, branch, status } = req.body;

    const bank = new Bank({
      bankName,
      accountNumber,
      accountHolder,
      ifscCode,
      branch,
      status
    });

    await bank.save();

    res.status(201).json({
      success: true,
      message: 'Bank created successfully',
      data: bank
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bank with this account number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBanks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      bankName: { $regex: search, $options: 'i' }
    } : {};

    const banks = await Bank.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Bank.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: banks,
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

const getBankById = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({
        success: false,
        message: 'Bank not found'
      });
    }
    res.status(200).json({
      success: true,
      data: bank
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateBank = async (req, res) => {
  try {
    const { bankName, accountNumber, accountHolder, ifscCode, branch, status } = req.body;
    
    const bank = await Bank.findByIdAndUpdate(
      req.params.id,
      { bankName, accountNumber, accountHolder, ifscCode, branch, status },
      { new: true, runValidators: true }
    );
    
    if (!bank) {
      return res.status(404).json({
        success: false,
        message: 'Bank not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Bank updated successfully',
      data: bank
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bank with this account number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteBank = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({
        success: false,
        message: 'Bank not found'
      });
    }
    await bank.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Bank deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createBank, getBanks, getBankById, updateBank, deleteBank };