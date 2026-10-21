import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getFollowups, createFollowup, updateFollowup, deleteFollowup } from '../controllers/followupController.js';

const router = express.Router();

router.route('/').get(protect, getFollowups).post(protect, createFollowup);
router.route('/:id').put(protect, updateFollowup).delete(protect, deleteFollowup);

export default router;
