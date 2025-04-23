// models/eventType.ts
import {Sequelize,DataTypes} from 'sequelize';
import  {EventTypeInstance,EventTypeModelStatic} from '../types/model/eventType';

export default function defineEventType(sequelize: Sequelize, dataTypes: typeof DataTypes,): EventTypeModelStatic {
  const EventType = sequelize.define<EventTypeInstance>(
    'EventType',
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: dataTypes.TEXT,
      },
      durationMinutes: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      eventSlug: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    },
  ) as EventTypeModelStatic;

  EventType.associate = (models) => {
    EventType.belongsTo(models.User, {foreignKey: 'userId'});
    EventType.hasMany(models.Booking, {foreignKey: 'eventTypeId'});
    EventType.belongsToMany(models.Booking, {through: 'Event_Booking'});
  };

  return EventType;
}
