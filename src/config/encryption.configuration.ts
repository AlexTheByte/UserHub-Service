import { registerAs } from '@nestjs/config';

export const EncryptionTransformerConfig = {
  key: process.env.ENCRYPTION_KEY,
  iv: process.env.ENCRYPTION_IV,
  algorithm: 'aes-256-cbc',
  ivLength: 16,
};

export interface IEncryptionConfig {
  key: string;
  iv: string;
  algorithm: string;
  ivLength: number;
}

export const EncryptionConfiguration = registerAs('encryption', () => EncryptionTransformerConfig);
