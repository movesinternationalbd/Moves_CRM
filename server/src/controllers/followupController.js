import { asyncHandler } from '../utils/asyncHandler.js';
import Followup from '../models/Followup.js';

export const getFollowups = asyncHandler(async (req, res) => {
  const { lead } = req.query;
  const filter = {};
  if (lead) filter.lead = lead;
  const followups = await Followup.find(filter).populate('lead created_by').sort({ created_at: -1 });
  res.json({ success: true, followups });
});

export const createFollowup = asyncHandler(async (req, res) => {
  const followup = await Followup.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, followup });
});

export const updateFollowup = asyncHandler(async (req, res) => {
  const followup = await Followup.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!followup) return res.status(404).json({ success: false, message: 'Followup not found' });
  res.json({ success: true, followup });
});

export const deleteFollowup = asyncHandler(async (req, res) => {
  const followup = await Followup.findById(req.params.id);
  if (!followup) return res.status(404).json({ success: false, message: 'Followup not found' });
  await followup.deleteOne();
  res.json({ success: true, message: 'Followup removed' });
});
