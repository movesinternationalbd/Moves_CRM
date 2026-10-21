import { asyncHandler } from '../utils/asyncHandler.js';
import Lead from '../models/Lead.js';
import User from '../models/User.js';

export const getLeads = asyncHandler(async (req, res) => {
  const { status, search, assigned } = req.query;
  const filter = {};
  if (status) filter.lead_status = status;
  if (search) {
    filter.$or = [
      { student_name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (assigned) filter.assigned_counsellor = assigned;
  const leads = await Lead.find(filter).populate('country assigned_executive assigned_counsellor created_by').sort({ created_at: -1 });
  res.json({ success: true, leads });
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate('country assigned_executive assigned_counsellor created_by');
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, lead });
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, lead });
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, lead });
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  await lead.deleteOne();
  res.json({ success: true, message: 'Lead removed' });
});
