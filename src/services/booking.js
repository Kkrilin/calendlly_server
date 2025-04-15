import EventTypeController from '../controllers/eventType.js';
import BookingController from '../controllers/booking.js';
import UserController from '../controllers/user.js';
import utils from '../helper/utils.js';
import AvailabilityController from '../controllers/availability.js';
import moment from 'moment';

export const getAllBooking = async function (req, res, next) {
  const { userId } = req;
  try {
    let bookings = await BookingController.findAllByUserId(userId);
    if (bookings.length) {
      bookings = bookings.reduce((acc, cur) => {
        const localStringDate = moment(cur.start_time).format('YYYY-MM-DD');
        acc[localStringDate] = acc[localStringDate] || [];
        acc[localStringDate].push(cur);
        return acc;
      }, {});
    }

    return res.status(200).json({ sucess: 1, bookings });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const getBooking = async function (req, res, next) {
  const { id } = req.params;

  try {
    const booking = await BookingController.findOneById(id);
    return res.status(200).json({ sucess: 1, booking });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const deleteBooking = async function (req, res, next) {
  const { id } = req.params;

  try {
    await BookingController.deleteById(id);
    return res.status(200).json({ sucess: 1, message: 'Booking canceled' });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const validTimeSlots = async function (req, res, next) {
  const { userId, eventTypeId } = req.params;
  const { meetingDate } = req.query;

  const dayOfWeek = new Date(meetingDate).getDay();
  try {
    const eventType = await EventTypeController.findOneByIdForBook(
      userId,
      eventTypeId,
    );
    if (!eventType) {
      throw new Error('event type Does not exist booking can not possible');
    }
    const availability = await AvailabilityController.findAllByDayOfWeek(
      userId,
      dayOfWeek,
    );
    if (!availability) {
      throw new Error('availability is configured');
    }
    const startTime = availability?.start_time;
    const endTime = availability?.end_time;
    const meetingDuration = eventType?.durationMinutes;
    let timeSlots = [];
    if (startTime && endTime && meetingDuration) {
      timeSlots = await utils.getTimeSlots(
        startTime,
        endTime,
        meetingDuration,
        meetingDate,
        userId,
      );
    }

    return res.status(201).json({ sucess: 1, timeSlots });
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

export const createBooking = async function (req, res, next) {
  const { userId, eventTypeId } = req.params;
  const { guestName, guestEmail, bookDate, bookTime, description } = req.body;
  try {
    const eventType = await EventTypeController.findOneByIdForBook(
      userId,
      eventTypeId,
    );
    if (!eventType) {
      throw new Error('event type Does not exist booking can not possible');
    }
    const { startTime, endTime } = utils.mergeDateAndTimeWithDuration(
      bookDate,
      bookTime,
      eventType.durationMinutes,
    );
    const values = {
      description: description || '',
      eventTypeId,
      guest_name: guestName,
      guest_email: guestEmail,
      start_time: startTime,
      end_time: endTime,
      userId,
    };

    const booking = await BookingController.createBooking(values);
    return res.status(201).json({ sucess: 1, booking });
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

export const getAllEventForBook = async function (req, res, next) {
  const { userId } = req.params;
  try {
    const eventTypes = await EventTypeController.findAllByUserId(userId);
    return res.status(200).json({ sucess: 1, eventTypes });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};
