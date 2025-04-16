import db from '../models/index.js';

// const eventType = db.EventType;

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

//  find event by id
eventTypeController.findOneById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return db.EventType.findOne(filter);
};

//  find event by slug
eventTypeController.findOneByEventTyepSlug = (eventSlug) => {
  const filter = {
    where: {
      eventSlug,
    },
  };
  return db.EventType.findOne(filter);
};

//  find event for book
eventTypeController.findOneByIdForBook = (userId, id) => {
  const filter = {
    where: {
      id,
      userId,
    },
    include: { model: db.User },
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
