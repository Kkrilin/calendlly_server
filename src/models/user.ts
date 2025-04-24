import { Sequelize, DataTypes } from 'sequelize';
import { UserInstance, UserModelStatic } from '../types/model/user';

// Final export
export default function defineUserModel(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes,
): UserModelStatic {
  const User = sequelize.define<UserInstance>(
    'User',
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: dataTypes.STRING,
      },
      profileSlug: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      googleId: {
        type: dataTypes.STRING,
      },
      refreshToken: {
        type: dataTypes.TEXT,
      },
    },
    {
      tableName: 'Users',
      timestamps: true,
    },
  ) as UserModelStatic;

  User.associate = (models) => {
    User.hasMany(models.EventType, { foreignKey: 'userId' });
    User.hasMany(models.Availability, { foreignKey: 'userId' });
    User.hasMany(models.Booking, { foreignKey: 'userId' });
  };

  return User;
}
