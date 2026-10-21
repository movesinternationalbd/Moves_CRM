import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getCountries, createCountry, updateCountry, deleteCountry } from '../controllers/countryController.js';

const router = express.Router();

router.get('/', protect, getCountries);
router.post('/', protect, authorize('super_admin', 'admin'), createCountry);
router.put('/:id', protect, authorize('super_admin', 'admin'), updateCountry);
router.delete('/:id', protect, authorize('super_admin'), deleteCountry);

export default router;
