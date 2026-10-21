import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, authorize('super_admin', 'admin'), getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('super_admin'), deleteUser);

export default router;
