import { asyncHandler } from '../utils/asyncHandler.js';
import Payment from '../models/Payment.js';

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({}).populate('student created_by').sort({ created_at: -1 });
  res.json({ success: true, payments });
});

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, payment });
});

export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  res.json({ success: true, payment });
});

export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  await payment.deleteOne();
  res.json({ success: true, message: 'Payment removed' });
});
