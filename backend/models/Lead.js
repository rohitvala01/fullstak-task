const mongoose = require('mongoose');

const LEAD_STATUSES = ['New', 'Contacted', 'Converted'];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is invalid'],
    },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    status: {
      type: String,
      enum: { values: LEAD_STATUSES, message: 'Status must be one of: ' + LEAD_STATUSES.join(', ') },
      default: 'New',
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Lead', leadSchema);
module.exports.LEAD_STATUSES = LEAD_STATUSES;
