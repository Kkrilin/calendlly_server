import db from '../models/index.js';

// const booking = db.Booking;

const bookingController = {};

//  find all by user
bookingController.findAllByUserId = (userId) => {
  const filter = {
    where: {
      userId,
    },
    include: [{ model: db.EventType }, { model: db.User }],
    order: [['start_time', 'ASC']],
  };
  return db.Booking.findAll(filter);
};

//  find booking by id
bookingController.getOneById = (id) => {
  const filter = {
    where: {
      id,
    },
    include: [{ model: db.EventType }, { model: db.User }],
  };
  return db.Booking.findOne(filter);
};

//  find booking by id
bookingController.findAllByDateFilter = (userId, targetDate, nextDay, bookingId) => {
  const filter = {
    where: {
      start_time: {
        [db.Op.gte]: targetDate,
        [db.Op.lt]: nextDay,
      },
      userId,
    },
  };
  if (bookingId) {
    filter.where.id = {[db.Op.ne]: bookingId };
  }
  return db.Booking.findAll(filter);
};

// find user by email
bookingController.deleteById = (id) => {
  const filter = {
    where: {
      id,
    },
  };
  return db.Booking.destroy(filter);
};

// create event_type
bookingController.createBooking = async (values = {}, options = {}) => {
  const booking = await db.Booking.create(values, options);
  if (!booking) {
    throw new Error('booking failed to create');
  }
  return booking;
};

// update booking
bookingController.updateById = (id, value, options = {}) => {
  const filter = {
    where: {
      id,
    },
    ...options,
  };
  return db.Booking.update(value, filter);
};

export default bookingController;
