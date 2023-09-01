import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILoggerConfig } from 'src/config/logger.configuration';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {}

  init(fileName: string) {
    const level = this.configService.get<ILoggerConfig>('logger').level;

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.align(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${fileName}] ${level}: ${message}`;
        }),
      ),
      transports: [
        new DailyRotateFile({
          filename: 'storage/logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m', // Taille maximale du fichier avant la rotation
          maxFiles: '14d', // Conserver les journaux pendant 14 jours
          level,
        }),
        new winston.transports.Console({
          level,
        }),
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
