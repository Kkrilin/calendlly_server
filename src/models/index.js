import { Sequelize, DataTypes, Op } from 'sequelize';
import config from '../../config/config.js';
import { logger } from '../../config/logger.js';
import user from './user.js';
import eventType from './eventType.js';
import availability from './availability.js';
import booking from './booking.js';
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    ssl: config.ssl === 'true',
    dialectOptions: config.ssl
      ? {
          ssl: {
            require: config.ssl === 'true',
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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Op;
db.sequelize
  .sync({ force: false })
  .then(async () => {
    logger.info('Database connected');
  })
  .catch((err) => {
    logger.info('Failed to sync db: ' + err);
  });

db.User = user(sequelize, DataTypes);
db.EventType = eventType(sequelize, DataTypes);
db.Availability = availability(sequelize, DataTypes);
db.Booking = booking(sequelize, DataTypes);
db.User.associate(db);
db.EventType.associate(db);
db.Availability.associate(db);
db.Booking.associate(db);
export default db;
