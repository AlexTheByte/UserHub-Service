import { registerAs } from '@nestjs/config';

export interface IThrottleConfig {
  ttl: number;
  limit: number;
}

export default registerAs('throttle', () => ({
  ttl: parseInt(process.env.THROTTLE_TTL),
  limit: parseInt(process.env.THROTTLE_LIMIT),
}));
