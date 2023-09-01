import { registerAs } from '@nestjs/config';

export interface IJWTConfig {
  secret: string;
  signOptions: { expiresIn: string };
}

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
}));
