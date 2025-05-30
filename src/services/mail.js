import nodemailer from 'nodemailer';
import 'dotenv/config';
import moment from 'moment';
import { logger } from '../../config/logger.js';
import config from '../../config/config.js';

const {user, pass} = config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass,
  },
});

const emailService = {};

emailService.toHost = async ({
  name,
  email,
  guestName,
  eventName,
  formattedDate,
  duration,
  reschedule,
  rescheduleReason,
}) => {
  const html = `
  <h3>Hi ${name},</h3>
  <p>Your booking for an event <strong>${eventName}</strong> on google calender is confirmed.</p>
  <h4>you hosting and event with <strong> ${guestName}</strong></h4>
  <p><strong>Date:</strong> ${formattedDate}</p>
  <p><strong>Duration:</strong> ${duration} minutes</p>
  ${reschedule ? '<h3>this event is rescheduled</h3>' : ''}
  ${reschedule ? `<p> reason:${rescheduleReason}</p>` : ''}
  <p>this is system generated mail do not reply</p>
`;

  await transporter.sendMail({
    from: user,
    to: email,
    subject: 'Booking Confirmation',
    html,
  });
};

emailService.toGuest = async ({
  name,
  email,
  guestName,
  guestEmail,
  eventName,
  formattedDate,
  duration,
  reschedule,
  rescheduleReason,
}) => {
  const html = `
  <h3>Hi ${guestName},</h3>
  <p>Your booking for an event on  <strong>${eventName}</strong> on google calender is confirmed.</p>
  <h4>you as guest being hosted by <strong> ${name}</strong> for an event</h4>
  <p><strong>Date:</strong> ${formattedDate}</p>
  <p><strong>Duration:</strong> ${duration} minutes</p>
  ${reschedule ? '<h3>this event is rescheduled</h3>' : ''}
  ${reschedule ? `<p> reason:${rescheduleReason}</p>` : ''}
  <p>this is system generated mail do not reply</p>
`;
  console.log('guestEmail', guestEmail);
  await transporter.sendMail({
    from: user,
    to: guestEmail,
    subject: 'Booking Confirmation',
    html,
  });
};

emailService.sendBookingConfirmation = async ({
  bookTime,
  hostEmail,
  guestEmail,
  guestName,
  eventName,
  date,
  duration,
  name,
  reschedule,
  rescheduleReason,
}) => {
  const timeZone = 'Asia/Kolkata';
  const fullDateTime = moment.tz(
    `${date} ${bookTime}`,
    'YYYY-MM-DD hh:mm A',
    timeZone,
  );

  const formattedDate = fullDateTime.format('M/D/YYYY, h:mm:ss A');

  try {
    const data = {
      name,
      email: hostEmail,
      guestName,
      eventName,
      formattedDate,
      duration,
      guestEmail,
      reschedule,
      rescheduleReason,
    };
    await emailService.toHost(data);
    await emailService.toGuest(data);

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

emailService.reminderNotificationEmail = async (data) => {
  const html = `
  <h3>This is reminder for an upcoming event: <strong>${data.eventName}</strong> </h3>
  <p> Attendees :<strong>${data.name}, ${data.guestName}</strong> on google calender is confirmed.</p>
  <p><strong>Date:</strong> ${data.formattedDate}</p>
  <p><strong>Duration:</strong> ${data.duration} minutes</p>
  <p>this is system generated mail do not reply</p>
`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: [data.email, data.guestEmail],
    subject: 'Booking Confirmation',
    html,
  });
  logger.info('Reminder sent SuccessFul');
};

export default emailService;
