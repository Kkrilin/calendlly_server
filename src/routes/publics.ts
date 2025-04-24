import express from 'express';
import {getEventTypeForBook} from '../services/eventType.ts';
import {createBooking,validTimeSlots,getAllEventForBook,getBookings,rescheduleBooking} from '../services/booking.ts';

const router = express.Router();

router.get('/look-up/:userId', getAllEventForBook);
router.get('/look-up/:userId/:eventTypeId', getEventTypeForBook);
router.get('/reschedules/:bookingId', getBookings);
router.post('/reschedules/:bookingId', rescheduleBooking);
router.post('/events/:userId/:eventTypeId', createBooking);
router.get('/slots/:userId/:eventTypeId', validTimeSlots);
export default router;
