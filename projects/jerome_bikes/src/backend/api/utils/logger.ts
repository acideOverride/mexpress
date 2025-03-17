/**
 * Logger Utility
 * Configurable logging system for the API
 */
import winston from 'winston';
import { env } from '../../../shared/config/env';

// Define log format
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ''
    }`;
  }
);

// Create the logger
const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormat
  ),
  defaultMeta: { service: 'jerome-bikes-api' },
  transports: [
    // Console logger
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
  ],
});

// Add file transports in production
if (env.isProduction) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/jerome-bikes-error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
  
  logger.add(
    new winston.transports.File({
      filename: 'logs/jerome-bikes-combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
}

// Export logger
export default logger;