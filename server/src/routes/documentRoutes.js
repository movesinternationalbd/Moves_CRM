import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDocuments, createDocument, deleteDocument } from '../controllers/documentController.js';

const router = express.Router();

router.route('/').get(protect, getDocuments).post(protect, createDocument);
router.route('/:id').delete(protect, deleteDocument);

export default router;
