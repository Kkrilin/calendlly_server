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
  return db.EventType.findAll(filter);
};

//  find user by name
eventTypeController.findOneById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return db.EventType.findOne(filter);
};

// find user by email
eventTypeController.deleteById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return db.EventType.destroy(filter);
};

// create event_type
eventTypeController.creatEventType = async (values = {}) => {
  const eventType = await db.EventType.create(values);
  if (!eventType) {
    throw new Error('event Type failed to create');
  }
  return eventType;
};

export default eventTypeController;
