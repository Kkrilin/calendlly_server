import express from 'express';
import {
  getAllBooking,
  deleteBooking,
} from '../services/booking.js';

const router = express();

router.get('/', getAllBooking);
router.post('/:id', deleteBooking);

// public


export default router;
