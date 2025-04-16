import slug from 'slug';
import db from '../models/index.js';
import UserController from '../controllers/user.js';
import eventTypeController from '../controllers/eventType.js';
import BookingController from '../controllers/booking.js';
import moment from 'moment';
import config from '../../config/config.js';
import crypto from 'crypto';
import { Buffer } from 'buffer';

const { encryptionKey } = config;
const IV_LENGTH = 16;

const utils = {};

utils.encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

utils.decrypt = (text) => {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

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
  const slots = [];

  const selectedDate = moment.utc(meetingDate).tz('Asia/Kolkata');
  const now = moment().tz('Asia/Kolkata');
  const targetDate = selectedDate.format('YYYY-MM-DD');
  let startDateTime = null;

  if (selectedDate.isSame(now, 'day')) {
    const futureTime = now.clone().add(4, 'hours').startOf('hour');
    const slotStartTime = moment.tz(
      `${targetDate} ${startTime}`,
      'YYYY-MM-DD HH:mm',
      'Asia/Kolkata',
    );

    if (futureTime.isBefore(slotStartTime)) {
      startDateTime = slotStartTime;
    } else {
      startDateTime = futureTime;
    }
  } else {
    startDateTime = moment.tz(`${targetDate} ${startTime}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
  }
  const endDateTime = moment(`${targetDate} ${endTime}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');

  const nextDay = moment(targetDate).add(1, 'day').format('YYYY-MM-DD');
  const bookings = await BookingController.findAllByDateFilter(
    userId,
    targetDate,
    nextDay,
  );
  const plainBookings = bookings.map((b) => b.get({ plain: true }));

  const bookedIntervals = plainBookings
    .map((book) => ({
      start: moment(book.start_time),
      end: moment(book.end_time),
    }))
    .sort((a, b) => a.start - b.start);

  let current = startDateTime.clone();

  for (let i = 0; i <= bookedIntervals.length; i++) {
    const booking = bookedIntervals[i];

    const nextBlockedStart = booking ? booking.start : endDateTime;

    while (
      current
        .clone()
        .add(meetingDuration, 'minutes')
        .isSameOrBefore(nextBlockedStart)
    ) {
      const potentialEnd = current.clone().add(meetingDuration, 'minutes');
      if (potentialEnd.isAfter(endDateTime)) break;

      slots.push(utils.format12Hour(current.toDate()));
      current.add(meetingDuration, 'minutes');
    }

    if (booking && current.isBefore(booking.end)) {
      current = booking.end.clone();
    }
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

utils.timeExistInBetweenWithDuration = (slot, startTime, endTime, duration) => {
  const time = moment(slot, 'hh:mm A');
  const timeAfterDuration = time.clone().add(duration, 'minutes');
  const time1 = moment(startTime, 'hh:mm A');
  const time2 = moment(endTime, 'hh:mm A');

  return (
    timeAfterDuration.isAfter(time1) &&
    (timeAfterDuration.isBefore(time2) || timeAfterDuration.isSame(time2))
  );
};

utils.timeExistInBetween = (slot, startTime, endTime) => {
  const time = moment(slot, 'hh:mm A');
  const time1 = moment(startTime, 'hh:mm A');
  const time2 = moment(endTime, 'hh:mm A');

  return time.isAfter(time1) && time.isBefore(time2);
};

utils.timeDiff = (time1, time2) => {
  const start = moment('09:00 AM', 'hh:mm A');
  const end = moment('09:15 AM', 'hh:mm A');

  return end.diff(start, 'minutes');
};

export default utils;
