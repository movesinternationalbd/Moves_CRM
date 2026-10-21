import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getNotifications, createNotification, markRead, deleteNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/', protect, createNotification);
router.patch('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteNotification);

export default router;
