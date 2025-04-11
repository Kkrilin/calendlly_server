import db from '../models/index.js';

const availability = db.Availability;

const availabilityController = {};

//  find all by user
availabilityController.findAllByUserId = (userId) => {
  const filter = {
    where: {
      userId,
      active: 1,
    },
  };
  return availability.findAll(filter);
};

//  find availability by id
availabilityController.findOneById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return availability.findOne(filter);
};

// update availibility
availabilityController.updateById = (userId, id, value) => {
  const filter = {
    where: {
      userId,
      id,
    },
  };
  return availability.update(value, filter);
};

// create availability
availabilityController.creatEventType = async (values = {}) => {
  const availability = await availability.create(values);
  if (!availability) {
    throw new Error('availability failed to create');
  }
  return availability;
};

export default availabilityController;
