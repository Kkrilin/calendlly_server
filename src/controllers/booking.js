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

// //  find booking by id
// bookingController.findAllByUserId = (userId) => {
//   const filter = {
//     where: {
//       userId,
//     },
//     include: [{ model: db.EventType }, { model: db.User }],
//   };
//   return db.Booking.findAll(filter);
// };

//  find booking by id
bookingController.findAllByDateFilter = (userId, targetDate, nextDay) => {
  const filter = {
    where: {
      start_time: {
        [db.Op.gte]: targetDate,
        [db.Op.lt]: nextDay,
      },
      userId,
    },
  };
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
  console.log('values', values);
  const booking = await db.Booking.create(values, options);
  if (!booking) {
    throw new Error('booking failed to create');
  }
  return booking;
};

export default bookingController;
