import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

const secretKey = 'privateKey'; // TODO : Params à mettre

@Injectable()
export default class EncryptionService {
  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  }

  static decrypt(encryptedData: string): string {
    return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
  }
}
