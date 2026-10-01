const Lead = require('../models/Lead');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//POST api
const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const lead = await Lead.create({ name, email, phone });
  res.status(201).json({ success: true, data: lead });
});

//GET api
const getLeads = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filter = {};
  if (status) filter.status = status;
  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: leads,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
});

//PATCH api
const updateLeadStatus = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { returnDocument: 'after', runValidators: true }
  );
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.status(200).json({ success: true, data: lead });
});

//DELETE api
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.status(200).json({ success: true, message: 'Lead deleted', data: lead });
});

module.exports = { createLead, getLeads, updateLeadStatus, deleteLead };
