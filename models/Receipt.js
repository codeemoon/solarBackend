const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  voucherNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mode: {
    type: String,
    enum: ['cash', 'bank_transfer', 'upi', 'cheque'],
    default: 'cash'
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  },
  referenceNo: {
    type: String
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Receipt', receiptSchema);