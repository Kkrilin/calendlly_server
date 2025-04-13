import express from 'express';
import {
  getEventType,
  creatEvent,
  deleteEventType,
  getAllEventType,
  getEventTypeForBook,
} from '../services/eventType.js';

const router = express();

router.post('/', creatEvent);
router.get('/', getAllEventType);
router.get('/:id', getEventType);
router.get('/:userId/:eventId', getEventTypeForBook);
router.delete('/:id', deleteEventType);

export default router;
