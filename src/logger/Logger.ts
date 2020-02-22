import { createLogger as createWinstonLogger, format, transports, Logger } from 'winston';
import * as path from 'path';

export const createLogger = (service?: string): Logger => {
  return createWinstonLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    transports: [
      new transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
      new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.align(),
          format.printf(info => {
            const { timestamp, level, message, ...args } = info;
            const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
          }),
        ),
      }),
    ],
  });
};

export const InjectLogger: (service?: string) => PropertyDecorator = service => (
  target: object,
  propertyName: string | symbol,
): void => {
  const logger = createLogger(service);
  Object.defineProperty(target, propertyName, {
    get: () => logger,
  });
};
