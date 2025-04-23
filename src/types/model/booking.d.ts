import { Model, ModelStatic, Optional } from 'sequelize';

export interface BookingAttributes {
  id: string;
  guest_name: string;
  guest_email: string;
  start_time: Date;
  end_time: Date;
  reminderSent?: boolean;
  isReschedule?: boolean;
  rescheduleBy?: string;
  googleEventId?: string;
  rescheduleReason?: string;
  userId?: string;
  eventTypeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BookingCreationAttributes
  extends Optional<
    BookingAttributes,
    | 'id'
    | 'reminderSent'
    | 'isReschedule'
    | 'rescheduleBy'
    | 'googleEventId'
    | 'rescheduleReason'
    | 'userId'
    | 'eventTypeId'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

export interface BookingInstance
  extends Model<BookingAttributes, BookingCreationAttributes>,
    BookingAttributes {}

export interface BookingModelStatic
  extends ModelStatic<BookingInstance> {
  associate(models: any): void;
}
