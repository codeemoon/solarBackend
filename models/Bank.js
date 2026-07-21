const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  accountHolder: {
    type: String,
    required: true
  },
  ifscCode: {
    type: String,
    trim: true,
    uppercase: true
  },
  branch: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bank', bankSchema);