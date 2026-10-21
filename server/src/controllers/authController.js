import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  const user = await User.create({ name, email, password, role: role || 'counsellor', phone });
  res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
