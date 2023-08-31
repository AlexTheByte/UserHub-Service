import EncryptionService from './encryption.service';

export default class EncryptionTransformer {
  public static to(value: string): string {
    return EncryptionService.encrypt(value);
  }

  public static from(value: string): string {
    return EncryptionService.decrypt(value);
  }
}
