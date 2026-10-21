import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getLeads, getLead, createLead, updateLead, deleteLead } from '../controllers/leadController.js';

const router = express.Router();

router.route('/').get(protect, getLeads).post(protect, createLead);
router.route('/:id').get(protect, getLead).put(protect, updateLead).delete(protect, deleteLead);

export default router;
