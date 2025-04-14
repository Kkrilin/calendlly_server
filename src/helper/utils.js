import slug from 'slug';
import db from '../models/index.js';
import UserController from '../controllers/user.js';
import eventTypeController from '../controllers/eventType.js';
import BookingController from '../controllers/booking.js';
import moment from 'moment';

const utils = {};

utils.slugify = (val) => {
  if (val === null) {
    return null;
  }
  return (
    slug(val, {
      lower: true,
      remove: null,
    }) || val
  );
};

const checkProfileSlugExist = async (slug) =>
  await UserController.findOneByProfileSlug(slug);

utils.uniqueProfileSlug = async (slug) => {
  let count = 1;
  let uniqueSlug = slug;
  while (await checkProfileSlugExist(uniqueSlug)) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }
  return uniqueSlug;
};

const checkEventTypeSlugExist = async (slug) =>
  await eventTypeController.findOneByEventTyepSlug(slug);

utils.uniqueEventTypeSlug = async (slug) => {
  let count = 1;
  let uniqueSlug = slug;
  while (await checkEventTypeSlugExist(uniqueSlug)) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }
  return uniqueSlug;
};

utils.mergeDateAndTimeWithDuration = (dateStr, timeStr, duration) => {
  const [time, period] = timeStr.split(' ');
  let [h, m] = time.split(':').map(Number);

  if (period?.toLowerCase() === 'pm' && h !== 12) h += 12;
  if (period?.toLowerCase() === 'am' && h === 12) h = 0;
  const [year, month, day] = dateStr.split('-').map(Number);
  const startTime = new Date(year, month - 1, day, h, m);

  const endTime = new Date(startTime.getTime() + duration * 60000);

  return { startTime, endTime };
};

utils.getTimeSlots = async (
  startTime,
  endTime,
  meetingDuration,
  meetingDate,
  userId,
) => {
  let slots = [];

  console.log('meeting', meetingDate);
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);
  const targetDate = moment(meetingDate).format('YYYY-MM-DD');
  const nextDay = moment(targetDate).add(1, 'day').format('YYYY-MM-DD');
  console.log('targetDate', targetDate, 'nextDay', nextDay);
  const bookings = await BookingController.findAllByDateFilter(
    userId,
    targetDate,
    nextDay,
  );

  // const bookings = await BookingController.findAllByUserId(userId);
  const plainBookings = bookings.map((booking) => booking.get({ plain: true }));
  const meetingDayBookingSlot = plainBookings.map((book) => [
    utils.format12Hour(book.start_time),
    utils.format12Hour(book.end_time),
  ]);
  while (current < end) {
    const next = new Date(current.getTime() + meetingDuration * 60000);

    if (next > end) break;

    slots.push(utils.format12Hour(current));
    current = next;
  }
  if (plainBookings.length) {
    console.log('booking exist');
    slots = slots.filter((slot) => {
      if (
        meetingDayBookingSlot.find((bookSlot) =>
          utils.timeExistInBetween(
            slot,
            bookSlot[0],
            bookSlot[1],
            meetingDuration,
          ),
        )
      ) {
        return false;
      } else {
        return true;
      }
    });
  }

  return slots;
};

utils.format12Hour = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

utils.timeExistInBetween = (slot, startTime, endTime, duration) => {
  const time = moment(slot, 'hh:mm A');
  const timeAfterDuration = time.clone().add(duration, 'minutes');
  const time1 = moment(startTime, 'hh:mm A');
  const time2 = moment(endTime, 'hh:mm A');

  return (
    timeAfterDuration.isAfter(time1) &&
    (timeAfterDuration.isBefore(time2) || timeAfterDuration.isSame(time2))
  );
};

utils.timeDiff = (time1, time2) => {
  const start = moment('09:00 AM', 'hh:mm A');
  const end = moment('09:15 AM', 'hh:mm A');

  return end.diff(start, 'minutes');
};

export default utils;
