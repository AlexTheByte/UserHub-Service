import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export default class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private readonly serviceName: string) {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.align(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${this.serviceName}] ${level}: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.File({
          filename: 'storage/logs/app.log',
        }),
        new winston.transports.Console(),
      ],
    });
  }

  log(level: string, message: string) {
    this.logger.log(level, message);
  }

  info(message: string) {
    this.logger.log('info', message);
  }

  error(message: string) {
    this.logger.log('error', message);
  }

  warn(message: string) {
    this.logger.log('warn', message);
  }

  debug(message: string) {
    this.logger.log('debug', message);
  }

  verbose(message: string) {
    this.logger.log('verbose', message);
  }
}
