/* eslint-disable no-undef */
//  config for sequelize cli and migration
import 'dotenv/config';

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    dialect: 'postgres',
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    dialect: 'postgres',
  },
};

export default config[env];
