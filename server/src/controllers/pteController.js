import { asyncHandler } from '../utils/asyncHandler.js';
import PteBatch from '../models/PteBatch.js';

export const getPteBatches = asyncHandler(async (req, res) => {
  const batches = await PteBatch.find({}).populate('students created_by').sort({ created_at: -1 });
  res.json({ success: true, batches });
});

export const createPteBatch = asyncHandler(async (req, res) => {
  const batch = await PteBatch.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, batch });
});

export const updatePteBatch = asyncHandler(async (req, res) => {
  const batch = await PteBatch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  res.json({ success: true, batch });
});

export const deletePteBatch = asyncHandler(async (req, res) => {
  const batch = await PteBatch.findById(req.params.id);
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  await batch.deleteOne();
  res.json({ success: true, message: 'Batch removed' });
});
