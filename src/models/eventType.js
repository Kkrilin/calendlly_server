export default function (sequelize, DataTypes) {
  const EventType = sequelize.define(
    'EventType',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventSlug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      paranoid: true, // Enables soft deletes
    },
  );

  EventType.associate = (models) => {
    EventType.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
      },
    });
    EventType.hasMany(models.Booking, {
      foreignKey: {
        fieldName: 'eventTypeId',
      },
    });
    EventType.belongsToMany(models.Booking, { through: 'Event_Booking' });
  };

  return EventType;
}
