import express from 'express';
import {
  getEventType,
  creatEvent,
  deleteEventType,
  getAllEventType,
} from '../services/eventType.js';

const router = express();

router.post('/', creatEvent);
router.get('/', getAllEventType);
router.get('/:id', getEventType);
router.delete('/:id', deleteEventType);

export default router;
