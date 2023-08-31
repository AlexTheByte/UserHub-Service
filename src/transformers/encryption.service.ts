import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';
import { IEncryptionConfig } from 'src/config/encryption.configuration';

// const secretKey = 'privateKey'; // TODO : Params à mettre

@Injectable()
export default class EncryptionService {
  static configService: ConfigService;

  constructor(@Inject() private readonly configService: ConfigService) {}

  static encrypt(data: string): string {
    const secretKey = this.configService.get<IEncryptionConfig>('encryption');
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  }

  static decrypt(encryptedData: string): string {
    const { secretKey } = EncryptionService.configService.get<IEncryptionConfig>('encryption');
    return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
  }
}
