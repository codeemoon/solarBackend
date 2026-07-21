const mongoose = require('mongoose');

const gstSchema = new mongoose.Schema({
  taxName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  rate: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['CGST', 'SGST', 'IGST', 'CESS']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gst', gstSchema);