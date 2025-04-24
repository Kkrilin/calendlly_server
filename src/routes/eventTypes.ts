import express from 'express';
import {getEventType,creatEvent,deleteEventType,getAllEventType} from '../services/eventType.ts';

const router = express.Router();

router.post('/', creatEvent);
router.get('/', getAllEventType);
router.get('/:id', getEventType);
router.delete('/:id', deleteEventType);

export default router;
