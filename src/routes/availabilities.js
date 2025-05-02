import express from 'express';
import {
  createAvailability,
  updateAvailability,
  getAllAvailability,
} from '../services/availability.js';

const router = express();

router.post('/', createAvailability);
router.get('/', getAllAvailability);
router.put('/:id', updateAvailability);

export default router;
