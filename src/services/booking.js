import EventTypeController from '../controllers/eventType.js';
import BookingController from '../controllers/booking.js';
import UserController from '../controllers/user.js';
import utils from '../helper/utils.js';
import AvailabilityController from '../controllers/availability.js';
import moment from 'moment';
import { google } from 'googleapis';
import config from '../../config/config.js';
import db from '../models/index.js';
import emailService from './mail.js';
import { logger } from '../../config/logger.js';

const { googleClientId, googleSecretClient } = config;
const oauth2Client = new google.auth.OAuth2(googleClientId, googleSecretClient);

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
  const { meetingDate, bookingId } = req.query;
  const dayOfWeek = moment.utc(meetingDate).tz('Asia/Kolkata').day();
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
      throw new Error('availability is not configured');
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
        bookingId,
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
  const t = await db.sequelize.transaction();
  const mailData = {
    guestEmail: guestEmail,
    guestName,
  };

  try {
    const user = await UserController.findOneById(userId);
    if (!user) throw new Error('User not found');
    const eventType = await EventTypeController.findOneByIdForBook(
      userId,
      eventTypeId,
    );
    if (!eventType) {
      throw new Error('event type Does not exist booking can not possible');
    }
    mailData.eventName = eventType.title;
    mailData.duration = eventType.durationMinutes;
    mailData.date = bookDate;
    mailData.hostEmail = user.email;
    mailData.name = user.name;
    mailData.bookTime = bookTime;
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

    const booking = await BookingController.createBooking(values, {
      transaction: t,
    });
    if (user.googleId && user.refreshToken) {
      const refreshToken = utils.decrypt(user.refreshToken);
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      try {
        const { token } = await oauth2Client.getAccessToken();
        oauth2Client.setCredentials({
          refresh_token: refreshToken,
          access_token: token,
        });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const timeZone = 'Asia/Kolkata';
        const formattedStart = moment.tz(startTime, timeZone).format();
        const formattedEnd = moment.tz(endTime, timeZone).format();
        const resGoogleEvent = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            summary: `Meeting: ${eventType.title}`,
            description,
            start: {
              dateTime: formattedStart,
              timeZone,
            },
            end: {
              dateTime: formattedEnd,
              timeZone,
            },
            attendees: [{ email: guestEmail }, { email: user.email }],
          },
        });
        const googleEventId = resGoogleEvent.data.id;
        booking.googleEventId = googleEventId;
        await booking.save();
      } catch (calendarErr) {
        logger.error(
          'Google Calendar Error:',
          calendarErr.response?.data || calendarErr.message || calendarErr,
        );
        throw new Error('Booking saved but calendar sync failed');
      }
    }
    await t.commit();
    await emailService.sendBookingConfirmation(mailData);
    return res.status(201).json({ sucess: 1, booking });
  } catch (error) {
    await t.rollback();
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

export const getBookings = async function (req, res, next) {
  const { bookingId } = req.params;

  try {
    const booking = await BookingController.getOneById(bookingId);
    if (!booking) {
      throw new Error('booking is cancelled');
    }
    return res.status(201).json({ sucess: 1, booking });
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

export const rescheduleBooking = async function (req, res, next) {
  const { bookingId } = req.params;
  const { bookDate, bookTime, description, rescheduleReason } = req.body;
  const t = await db.sequelize.transaction();
  const mailData = {
    rescheduleReason,
  };
  try {
    const booking = await BookingController.getOneById(bookingId);
    const user = booking.User;
    if (!user) throw new Error('User not found');
    const eventType = booking.EventType;
    if (!eventType) {
      throw new Error(
        'event type Does not exist or deleled booking can not possible',
      );
    }
    mailData.guestEmail = booking.guest_email;
    mailData.guestName = booking.guest_name;
    mailData.eventName = eventType.title;
    mailData.duration = eventType.durationMinutes;
    mailData.date = bookDate;
    mailData.hostEmail = user.email;
    mailData.name = user.name;
    mailData.bookTime = bookTime;
    mailData.reschedule = true;
    const { startTime, endTime } = utils.mergeDateAndTimeWithDuration(
      bookDate,
      bookTime,
      eventType.durationMinutes,
    );
    const values = {
      start_time: startTime,
      end_time: endTime,
      rescheduleReason: rescheduleReason,
      rescheduleBy: user.name,
      isReschedule: true,
    };
    const updatedBooking = await BookingController.updateById(
      bookingId,
      values,
      {
        transaction: t,
      },
    );
    if (user.googleId && user.refreshToken && booking.googleEventId) {
      const refreshToken = utils.decrypt(user.refreshToken);
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      try {
        const { token } = await oauth2Client.getAccessToken();
        oauth2Client.setCredentials({
          refresh_token: refreshToken,
          access_token: token,
        });
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const timeZone = 'Asia/Kolkata';
        const formattedStart = moment.tz(startTime, timeZone).format();
        const formattedEnd = moment.tz(endTime, timeZone).format();
        const res = await calendar.events.update({
          calendarId: 'primary',
          eventId: booking.googleEventId,
          requestBody: {
            summary: `Meeting: ${eventType.title}`,
            description,
            start: {
              dateTime: formattedStart,
              timeZone,
            },
            end: {
              dateTime: formattedEnd,
              timeZone,
            },
            attendees: [{ email: booking.guest_email }, { email: user.email }],
          },
        });
      } catch (calendarErr) {
        logger.error(
          'Google Calendar Error:',
          calendarErr.response?.data || calendarErr.message || calendarErr,
        );
        throw new Error('Booking saved but calendar sync failed');
      }
    }
    await t.commit();
    await emailService.sendBookingConfirmation(mailData);
    return res.status(201).json({ sucess: 1, booking });
  } catch (error) {
    await t.rollback();
    error.status = 401;
    next(error);
  }
};
