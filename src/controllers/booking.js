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
bookingController.createBooking = async (values = {}) => {
  console.log('values', values);
  const booking = await db.Booking.create(values);
  if (!booking) {
    throw new Error('booking failed to create');
  }
  return booking;
};

export default bookingController;
