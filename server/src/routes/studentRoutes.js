import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getStudents, getStudent, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';

const router = express.Router();

router.route('/').get(protect, getStudents).post(protect, createStudent);
router.route('/:id').get(protect, getStudent).put(protect, updateStudent).delete(protect, deleteStudent);

export default router;
