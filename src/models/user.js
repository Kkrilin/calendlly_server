export default function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        // allowNull: false,
      },
      googleId: {
        type: DataTypes.STRING,
        // allowNull: null,
      },
    },
    {},
  );

  User.associate = (models) => {
    User.hasMany(models.EventType, {
      foreignKey: 'userId',
    });
    User.hasMany(models.Availability, {
      foreignKey: 'userId',
    });
  };

  return User;
}
