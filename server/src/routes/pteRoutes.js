import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getPteBatches, createPteBatch, updatePteBatch, deletePteBatch } from '../controllers/pteController.js';

const router = express.Router();

router.route('/').get(protect, getPteBatches).post(protect, createPteBatch);
router.route('/:id').put(protect, updatePteBatch).delete(protect, deletePteBatch);

export default router;
