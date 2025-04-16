import express from 'express';
import { getEventTypeForBook } from '../services/eventType.js';
import {
  createBooking,
  validTimeSlots,
  getAllEventForBook,
  getBookings,
  rescheduleBooking,
} from '../services/booking.js';

const router = express();

router.get('/look-up/:userId', getAllEventForBook);
router.get('/look-up/:userId/:eventTypeId', getEventTypeForBook);
router.get('/reschedules/:bookingId', getBookings);
router.post('/reschedules/:bookingId', rescheduleBooking);
router.post('/events/:userId/:eventTypeId', createBooking);
router.get('/slots/:userId/:eventTypeId', validTimeSlots);
export default router;
