import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json({ success: true, users });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { name, email, role, phone } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.phone = phone || user.phone;
  const updated = await user.save();
  res.json({ success: true, user: { id: updated._id, name: updated.name, email: updated.email, role: updated.role, phone: updated.phone } });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  await user.deleteOne();
  res.json({ success: true, message: 'User removed' });
});
