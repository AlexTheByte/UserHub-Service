import { registerAs } from '@nestjs/config';

export interface IEncryptionConfig {
  secretKey: string;
}

export default registerAs<IEncryptionConfig>('encryption', () => ({
  secretKey: process.env.ENCRYPTION_SECRET_KEY,
}));
