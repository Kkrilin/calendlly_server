import { NextFunction, Request, Response } from 'express';
import availabilityController from '../controllers/availability.ts';
import EventTypeController from '../controllers/eventType.ts';
import UserController from '../controllers/user.ts';
import utils from '../helper/utils.ts';

export const getAllEventType = async function (req: Request, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const eventTypes = await EventTypeController.findAllByUserId(userId);
     res.status(200).json({ sucess: 1, eventTypes });
  } catch (error:any) {
    error.status = 404;
    next(error);
  }
};

export const getEventType = async function (req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const eventType = await EventTypeController.findOneById(id);
     res.status(200).json({ sucess: 1, eventType });
  } catch (error: any) {
    error.status = 404;
    next(error);
  }
};

export const getEventTypeForBook = async function (req: Request, res: Response, next: NextFunction) {
  const { userId, eventTypeId } = req.params;
  try {
    // const availabilities = await availabilityController.findAllByUserId(userId);
    const user = await UserController.findOneById(userId);
    if (!user) {
      throw new Error('user do not exist');
    }
    const eventType = await EventTypeController.findOneByIdForBook(
      userId,
      eventTypeId,
    );
     res.status(200).json({ sucess: 1, eventType });
  } catch (error: any) {
    error.status = 404;
    next(error);
  }
};

export const deleteEventType = async function (req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const eventType = await EventTypeController.deleteById(id);
     res
      .status(200)
      .json({ sucess: 1, message: 'eventType deleted SuccessFull' });
  } catch (error: any) {
    error.status = 404;
    next(error);
  }
};

export const creatEvent = async function (req: Request, res: Response, next: NextFunction) {
  const { userId } = req;
  const { eventName, description, duration } = req.body;
  const baseEventSlug = utils.slugify(eventName);
  const eventSlug = await utils.uniqueEventTypeSlug(baseEventSlug);

  const values = {
    title: eventName,
    description: description || '',
    durationMinutes: duration,
    userId,
    eventSlug,
  };

  try {
    const eventType = await EventTypeController.creatEventType(values);
     res.status(201).json({ sucess: 1, eventType });
  } catch (error: any) {
    error.status = 401;
    next(error);
  }
};
