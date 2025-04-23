import { Sequelize, DataTypes, Op, Dialect } from 'sequelize';
import config from '../config/config.js';
import { logger } from '../helper/logger.js';
import userModel from './user.js';
import eventTypeModel from './eventType.js';
import availabilityModel from './availability.js';
import bookingModel from './booking.js';


const sequelize = new Sequelize(
  config.db.database as string,
  config.db.username as string,
  config.db.password as string,
  {
    host: config.db.host,
    port: parseInt(config.db.port || ''),
    dialect: config.db.dialect as Dialect,
    logging: false,
    ssl: config.db.ssl === 'true',
    dialectOptions: config.db.ssl === 'true'
      ? {
          ssl: {
            require: config.db.ssl === 'true',
            rejectUnauthorized: false,
          },
        }
      : {},
    pool: {
      max: 15, // Maximum number of connections in the pool for production
      min: 5, // Minimum number of connections in the pool for production
      acquire: 30000, // Maximum time (in ms) to try getting a connection before throwing an error
      idle: 10000, // Maximum time (in ms) a connection can be idle before being released
    },
  },
);
interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  Op: typeof Op;
  User: ReturnType<typeof userModel>;
  EventType: ReturnType<typeof eventTypeModel>;
  Availability: ReturnType<typeof availabilityModel>;
  Booking: ReturnType<typeof bookingModel>;
}
const db = {} as DB;

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;


// model initailization
db.User = userModel(sequelize, DataTypes);
db.EventType = eventTypeModel(sequelize, DataTypes);
db.Availability = availabilityModel(sequelize, DataTypes);
db.Booking = bookingModel(sequelize, DataTypes);

// association setup
db.User.associate(db);
db.EventType.associate(db);
db.Availability.associate(db);
db.Booking.associate(db);

// Connect to DB
db.sequelize
  .authenticate()
  .then(async () => {
    logger.info('Database connected');
  })
  .catch((err) => {
    logger.info('Failed to sync db: ' + err);
  });
export default db;
