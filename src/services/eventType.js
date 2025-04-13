import EventTypeController from '../controllers/eventType.js';

export const getAllEventType = async function (req, res, next) {
  const { userId } = req;
  try {
    const eventTypes = await EventTypeController.findAllByUserId(userId);
    return res.status(200).json({ sucess: 1, eventTypes });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const getEventType = async function (req, res, next) {
  const { id } = req.params;

  try {
    const eventType = await EventTypeController.findOneById(id);
    return res.status(200).json({ sucess: 1, eventType });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const deleteEventType = async function (req, res, next) {
  const { id } = req.params;

  try {
    const eventType = await EventTypeController.deleteById(id);
    return res
      .status(200)
      .json({ sucess: 1, message: 'eventType deleted SuccessFull' });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const creatEvent = async function (req, res, next) {
  const { userId } = req;
  const { eventName, description, duration } = req.body;
  const values = {
    title: eventName,
    description: description || '',
    durationMinutes: duration,
    userId,
  };

  try {
    const eventType = await EventTypeController.creatEventType(values);
    return res.status(201).json({ sucess: 1, eventType });
  } catch (error) {
    error.status = 401;
    next(error);
  }
};
