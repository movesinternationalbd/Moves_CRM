import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getUniversities, createUniversity, updateUniversity, deleteUniversity } from '../controllers/universityController.js';

const router = express.Router();

router.get('/', protect, getUniversities);
router.post('/', protect, authorize('super_admin', 'admin'), createUniversity);
router.put('/:id', protect, authorize('super_admin', 'admin'), updateUniversity);
router.delete('/:id', protect, authorize('super_admin'), deleteUniversity);

export default router;
