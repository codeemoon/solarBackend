const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  voucherNumber: {
    type: String,
    required: true,
    unique: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
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
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);