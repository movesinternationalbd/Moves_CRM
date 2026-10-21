import { asyncHandler } from '../utils/asyncHandler.js';
import University from '../models/University.js';

export const getUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find({}).populate('country').sort({ name: 1 });
  res.json({ success: true, universities });
});

export const createUniversity = asyncHandler(async (req, res) => {
  const university = await University.create(req.body);
  res.status(201).json({ success: true, university });
});

export const updateUniversity = asyncHandler(async (req, res) => {
  const university = await University.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!university) return res.status(404).json({ success: false, message: 'University not found' });
  res.json({ success: true, university });
});

export const deleteUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) return res.status(404).json({ success: false, message: 'University not found' });
  await university.deleteOne();
  res.json({ success: true, message: 'University removed' });
});
