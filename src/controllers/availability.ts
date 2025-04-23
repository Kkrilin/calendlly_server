import db from '../models/index';
import { ControllerType } from '../types/index';


const availabilityController : ControllerType = {};

//  find all by user
availabilityController.findAllByUserId = (userId) => {
  const filter = {
    where: {
      userId,
      // active: 1,
    },
    order: [['day_of_week', 'ASC']],
  };
  return db.Availability.findAll(filter);
};

//  find availability by id
availabilityController.findOneById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return db.Availability.findOne(filter);
};

// update availibility
availabilityController.updateById = (userId, id, value) => {
  const filter = {
    where: {
      userId,
      id,
    },
  };
  return db.Availability.update(value, filter);
};

//  find one by dayoFWeek
availabilityController.findAllByDayOfWeek = (userId: string, dayOfWeek: number) => {
  const filter = {
    where: {
      userId,
      day_of_week: dayOfWeek,
      active: 1,
    },
  };
  return db.Availability.findOne(filter);
};

// create availability
availabilityController.creatAvailability = async (values = {}) => {
  const availability = await db.Availability.create(values);
  if (!availability) {
    throw new Error('availability failed to create');
  }
  return availability;
};

availabilityController.bulkCreateAvailability = async (values = []) => {
  const availabilities = await db.Availability.bulkCreate(values);
  if (!availabilities) {
    throw new Error('availability failed to create');
  }
  return availabilities;
};

export default availabilityController;
