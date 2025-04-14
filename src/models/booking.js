export default function (sequelize, DataTypes) {
  const Booking = sequelize.define(
    'Booking',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
        primaryKey: true,
      },
      // title: {
      //   type: DataTypes.CHAR,
      //   unique: true,
      //   allowNull: false,
      // },
      guest_name: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      guest_email: {
        type: DataTypes.CHAR,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      paranoid: true, // Enables soft deletes
    },
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
      },
    });
    Booking.belongsTo(models.EventType, {
      foreignKey: {
        fieldName: 'eventTypeId',
      },
    });
    Booking.belongsToMany(models.EventType, { through: 'Event_Booking' });
  };

  return Booking;
}
