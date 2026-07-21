const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true
  },
  actions: {
    type: [String],
    required: true
  }
}, { _id: false });

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String
  },
  permissions: {
    type: [permissionSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],  
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);