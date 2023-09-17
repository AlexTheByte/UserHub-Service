import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '@travel-1/travel-sdk';
import * as fs from 'fs';

@Injectable()
export class FilerService {
  constructor(private readonly loggerService: CustomLoggerService) {}

  /**
   * Write a new file in the folder provided
   * @param path Path to the folder
   * @param name Name of the file
   * @param buffer Buffer of the file
   */
  async write(path: string, name: string, buffer: Buffer) {
    this.loggerService.info(`Create new file in folder ${path}, the file "${name}"`);

    const fullPath = `${path}/${name}`;
    try {
      fs.writeFileSync(fullPath, buffer);
    } catch (e) {
      this.loggerService.error(e);
      throw e;
    }
  }

  /**
   * Delete a file
   * @param path Path to the folder
   * @param name Name of the file
   */
  async delete(path: string, name: string) {
    this.loggerService.info(`Delete in folder ${path}, the file "${name}"`);

    const fullPath = `${path}/${name}`;

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (e) {
      this.loggerService.error(e);
      throw e;
    }
  }
}
