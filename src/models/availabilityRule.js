export default function (sequelize, DataTypes) {
  const AvailabilityRule = sequelize.define(
    'AvailabilityRule',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
        primaryKey: true,
      },
      title: {
        type: DataTypes.CHAR,
        unique: true,
        allowNull: false,
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

  AvailabilityRule.associate = (models) => {
    AvailabilityRule.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
      },
    });
  };

  return AvailabilityRule;
}
