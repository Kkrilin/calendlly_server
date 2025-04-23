import express from 'express';
import config from './config/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import { logger, transport } from './helper/logger';
// import './services/cron';
import db from './models/index';

// import router
import userRouter from './routes/users';
import eventTypeRouter from './routes/eventTypes';
import availabilityRouter from './routes/availabilities';
import bookingRouter from './routes/bookings';
import publicRouter from './routes/publics';

// import  middleware
import errorHandler from './middleware/errorHandler';
import { authenticate } from './middleware/userAuth';

const app = express();
const port = config.serverPort || 3000;

// Handle errors in the transport
transport.on('error', (error) => {
  logger.error('Error in DailyRotateFile transport:', error);
});

// Handle log rotation events
transport.on('rotate', (oldFilename, newFilename) => {
  logger.info(`Log file rotated: ${oldFilename} -> ${newFilename}`);
});

// MiddleWare to log requests
app.use((req, res, next) => {
  logger.info(`Logger initialized successfully ${req.method} ${req.url}`);
  next();
});

app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));

const corsOptions: CorsOptions = {
  origin: config.clientUrl, // e.g., https://myapp.com
  credentials: true, // allow cookies to be sent
};
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// check server is running
app.use('/running', (req, res) => {
  res.status(200).send('<h1>server is running</h1>');
});

// user router
app.use('/auth', userRouter);
app.use('/api/*', authenticate);
// procted route
app.use('/api/users', userRouter);
app.use('/api/event-types', eventTypeRouter);
app.use('/api/availabilities', availabilityRouter);
app.use('/api/bookings', bookingRouter);

// public route
app.use('/bookings', publicRouter);

// Middleware to handle "route not found" errors and log them
app.use((req, res, next) => {
  const errorMessage = `Route not found: ${req.method} ${req.originalUrl}`;
  logger.warn(errorMessage);
  res.status(404).json({ error: 'Router not Found', message: errorMessage });
});

// Middleware to handle all other errors and log them
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`server is running on ${port}`);
});
