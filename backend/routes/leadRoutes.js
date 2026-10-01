const express = require('express');
const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
} = require('../controllers/leadController');
const { validateCreateLead, validateStatus, validateObjectId } = require('../middleware/validate');

const router = express.Router();

router.route('/').get(getLeads).post(validateCreateLead, createLead);
router.patch('/:id/status', validateObjectId, validateStatus, updateLeadStatus);
router.delete('/:id', validateObjectId, deleteLead);

module.exports = router;
