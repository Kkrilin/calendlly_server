import { Sequelize, DataTypes } from 'sequelize';
import type {
  BookingInstance,
  BookingModelStatic,
} from '../types/model/booking';

export default function defineBooking(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes,
): BookingModelStatic {
  const Booking = sequelize.define<BookingInstance>(
    'Booking',
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        primaryKey: true,
      },
      guest_name: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      guest_email: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      start_time: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      reminderSent: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
      isReschedule: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
      rescheduleBy: {
        type: dataTypes.STRING,
      },
      googleEventId: {
        type: dataTypes.STRING,
      },
      rescheduleReason: {
        type: dataTypes.STRING,
      },
    },
    {
      paranoid: true,
    },
  ) as BookingModelStatic;

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'userId' });
    Booking.belongsTo(models.EventType, { foreignKey: 'eventTypeId' });
    Booking.belongsToMany(models.EventType, { through: 'Event_Booking' });
  };

  return Booking;
}
