import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'logs/application-%DATE%.log', // Store logs in a 'logs' directory
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Create the logger instance
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    transport, // Add the DailyRotateFile transport
  ],
});

// Add a console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}
