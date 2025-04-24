import { NextFunction, Request, Response } from 'express';
import { logger } from '../helper/logger.js';
interface CustomError extends Error {
  status?: number;
}
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: 0,
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
