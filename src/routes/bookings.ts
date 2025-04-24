import express from 'express';
import {getAllBooking,deleteBooking} from '../services/booking.ts';

const router = express.Router();

router.get('/', getAllBooking);
router.delete('/:id', deleteBooking);


export default router;
