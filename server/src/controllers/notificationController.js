import { asyncHandler } from '../utils/asyncHandler.js';
import Notification from '../models/Notification.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ created_at: -1 });
  res.json({ success: true, notifications });
});

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, notification });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  res.json({ success: true, notification });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
  await notification.deleteOne();
  res.json({ success: true, message: 'Notification removed' });
});
