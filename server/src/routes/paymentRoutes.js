import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getPayments, createPayment, updatePayment, deletePayment } from '../controllers/paymentController.js';

const router = express.Router();

router.route('/').get(protect, getPayments).post(protect, createPayment);
router.route('/:id').put(protect, updatePayment).delete(protect, deletePayment);

export default router;
