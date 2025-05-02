export default function (sequelize, DataTypes) {
  const Availability = sequelize.define(
    'Availability',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
        primaryKey: true,
      },
      day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        // allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        // allowNull: null,
      },
      active: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultvalue: 1,
      },
    },
    // {
    //   paranoid: true, // Enables soft deletes
    // },
  );

  Availability.associate = (models) => {
    Availability.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
      },
    });
  };

  return Availability;
}
