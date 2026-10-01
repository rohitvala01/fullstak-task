const mongoose = require('mongoose');
const { LEAD_STATUSES } = require('../models/Lead');

const isBlank = (v) => typeof v !== 'string' || v.trim() === '';

const fail = (res, message) => res.status(400).json({ success: false, message });

const validateCreateLead = (req, res, next) => {
  const { name, email, phone } = req.body || {};
  if (isBlank(name) || isBlank(email) || isBlank(phone)) {
    return fail(res, 'name, email and phone are required');
  }
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return fail(res, 'Email is invalid');
  if (!/^[0-9+\-\s()]{7,15}$/.test(phone.trim())) return fail(res, 'Phone is invalid');
  next();
};

const validateStatus = (req, res, next) => {
  const { status } = req.body || {};
  if (!LEAD_STATUSES.includes(status)) {
    return fail(res, `status must be one of: ${LEAD_STATUSES.join(', ')}`);
  }
  next();
};

const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid lead id');
  next();
};

module.exports = { validateCreateLead, validateStatus, validateObjectId };
