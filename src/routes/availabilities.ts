import express from 'express';
import {
  createAvailability,
  updateAvailability,
  getAllAvailability,
} from '../services/availability.js';

const router = express.Router();

router.post('/', createAvailability);
router.get('/', getAllAvailability);
// router.put('/status/:id', updateAvailabilityStatus);
router.put('/:id', updateAvailability);

// router.delete('/:id', deleteEventTypebyId);

export default router;
