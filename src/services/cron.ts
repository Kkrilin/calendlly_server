import cron from 'node-cron';
import db from '../models/index.js';
import emailService from './mail.js';
import { logger } from '../helper/logger.js';

// cron service for reminder to upcoming event booking every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  const now = new Date();
  const after30Minute = new Date(now.getTime() + 30 * 60 * 1000);
  try {
    const bookings = await db.Booking.findAll({
      where: {
        start_time: {
          [db.Op.between]: [now, after30Minute],
        },
        reminderSent: false,
      },
      attributes: ['guest_email', 'guest_name', 'start_time', 'id'],
      include: [
        { model: db.EventType, attributes: ['durationMinutes', 'title'] },
        { model: db.User, attributes: ['email', 'name', 'id'] },
      ],
    });

    for (const booking of bookings) {
      const data = {
        email: booking.User.email,
        name: booking.User.name,
        guestEmail: booking.guest_email,
        guestName: booking.guest_name,
        duration: booking.EventType.durationMinutes,
        formattedDate: booking.start_time,
        eventName: booking.EventType.title,
      };

      await emailService.reminderNotificationEmail(data);
      const filter = {
        where: {
          userId: booking.User.id,
          id: booking.id,
        },
      };
      await db.Booking.update({ reminderSent: true }, filter);
      logger.info(``);
    }

    if (!bookings.length) {
      logger.info('no upcoming event booking for reminder mail');
    } else {
      logger.info(`reminder email sent for ${bookings.length}`);
    }
  } catch (error) {
    logger.error(error.message);
  }
});
