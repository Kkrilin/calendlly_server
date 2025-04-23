import { Model, Optional, ModelStatic } from 'sequelize';

export interface EventTypeAttributes {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  eventSlug: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface EventTypeCreationAttributes
  extends Optional<
    EventTypeAttributes,
    'id' | 'description' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

export interface EventTypeInstance
  extends Model<EventTypeAttributes, EventTypeCreationAttributes>,
    EventTypeAttributes {}

export interface EventTypeModelStatic
  extends ModelStatic<EventTypeInstance> {
  associate(models: any): void;
}
