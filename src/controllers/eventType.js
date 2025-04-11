import db from '../models/index.js';

const eventType = db.EventType;

const eventTypeController = {};

//  find all by user
eventTypeController.findAllByUserId = (userId) => {
  const filter = {
    where: {
      userId,
    },
  };
  return eventType.findAll(filter);
};

//  find user by name
eventTypeController.findOneById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return eventType.findOne(filter);
};

// find user by email
eventTypeController.deleteById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return eventType.distroy(filter);
};

// create event_type
eventTypeController.creatEventType = async (values = {}) => {
  const eventType = await eventType.create(values);
  if (!eventType) {
    throw new Error('event Type failed to create');
  }
  return eventType;
};

export default eventTypeController;
