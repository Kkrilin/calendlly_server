import { logger } from '../helper/logger.js';
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: 0,
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
