import { registerAs } from '@nestjs/config';

export interface ILoggerConfig {
  level: 'string';
}

export const LoggerConfiguration = registerAs('logger', () => ({
  level: process.env.LOGGER_LEVEL,
}));
