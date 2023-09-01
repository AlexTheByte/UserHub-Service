import { registerAs } from '@nestjs/config';

export interface IRedisConfig {
  host: string;
  port: number;
  password: string;
}

export const RedisConfiguration = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
}));
