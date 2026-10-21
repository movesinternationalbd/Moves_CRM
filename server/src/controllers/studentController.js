import { asyncHandler } from '../utils/asyncHandler.js';
import Student from '../models/Student.js';

export const getStudents = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { student_name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const students = await Student.find(filter).populate('lead university created_by').sort({ created_at: -1 });
  res.json({ success: true, students });
});

export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('lead university created_by');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, student });
});

export const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create({ ...req.body, created_by: req.user._id });
  res.status(201).json({ success: true, student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  await student.deleteOne();
  res.json({ success: true, message: 'Student removed' });
});
