import { Model, ModelStatic, Optional } from 'sequelize';

export interface AvailabilityAttributes {
  id: string;
  day_of_week: number;
  start_time?: string;
  end_time?: string;
  active: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AvailabilityCreationAttributes
  extends Optional<
    AvailabilityAttributes,
    'id' | 'start_time' | 'end_time' | 'userId' | 'createdAt' | 'updatedAt'
  > {}

export interface AvailabilityInstance
  extends Model<AvailabilityAttributes, AvailabilityCreationAttributes>,
    AvailabilityAttributes {}

export interface AvailabilityModelStatic
  extends ModelStatic<AvailabilityInstance> {
  associate(models: any): void;
}
