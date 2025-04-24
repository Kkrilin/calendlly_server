import { Sequelize, DataTypes } from 'sequelize';
import type {
  AvailabilityInstance,
  AvailabilityModelStatic,
} from '../types/model/availability.ts';

export default function defineAvailability(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes,
): AvailabilityModelStatic {
  const Availability = sequelize.define<AvailabilityInstance>('Availability', {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      primaryKey: true,
    },
    day_of_week: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: dataTypes.TIME,
    },
    end_time: {
      type: dataTypes.TIME,
    },
    active: {
      type: dataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }) as AvailabilityModelStatic;

  Availability.associate = (models) => {
    Availability.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Availability;
}
