import express from 'express';
import { getEventTypeForBook } from '../services/eventType.js';
import {
  createBooking,
  validTimeSlots,
  getAllEventForBook,
} from '../services/booking.js';

const router = express();

router.get('/look-up/:userId', getAllEventForBook);
router.get('/look-up/:userId/:eventTypeId', getEventTypeForBook);
router.post('/events/:userId/:eventTypeId', createBooking);
router.get('/slots/:userId/:eventTypeId', validTimeSlots);
export default router;
