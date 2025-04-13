import express from 'express';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { logger, transport } from './config/logger.js';
import db from './src/models/index.js';

// import router
import userRouter from './src/routes/users.js';
import eventTypeRouter from './src/routes/eventTypes.js';
import availabilityRouter from './src/routes/availability.js';

// import  middleware
import errorHandler from './src/middleware/errorHandler.js';
import { authenticate } from './src/middleware/userAuth.js';

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

const corsOptions = {
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
app.use('/api/event-types', eventTypeRouter);
app.use('/api/availability', availabilityRouter);

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
