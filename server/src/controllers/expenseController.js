import { asyncHandler } from '../utils/asyncHandler.js';
import Expense from '../models/Expense.js';

export const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({}).populate('created_by').sort({ created_at: -1 });
  res.json({ success: true, expenses });
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, expense });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
  res.json({ success: true, expense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
  await expense.deleteOne();
  res.json({ success: true, message: 'Expense removed' });
});
