import { asyncHandler } from '../utils/asyncHandler.js';
import Country from '../models/Country.js';

export const getCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find({}).sort({ name: 1 });
  res.json({ success: true, countries });
});

export const createCountry = asyncHandler(async (req, res) => {
  const country = await Country.create(req.body);
  res.status(201).json({ success: true, country });
});

export const updateCountry = asyncHandler(async (req, res) => {
  const country = await Country.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!country) return res.status(404).json({ success: false, message: 'Country not found' });
  res.json({ success: true, country });
});

export const deleteCountry = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);
  if (!country) return res.status(404).json({ success: false, message: 'Country not found' });
  await country.deleteOne();
  res.json({ success: true, message: 'Country removed' });
});
