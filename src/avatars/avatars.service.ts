import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { FilerService } from 'src/filer/filer.service';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class AvatarsService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    private readonly filerService: FilerService,
  ) {}

  async create(avatar: Express.Multer.File): Promise<string> {
    this.loggerService.debug(`Create new avatar. Original file name : ${avatar.originalname}`);
    const name = `${uuidv4()}.jpg`;
    const folderPath = '/usr/src/app/storage/avatars';

    const buffer = await sharp(avatar.buffer)
      .resize({ width: 300, height: 300 })
      .jpeg({ quality: 80 })
      .toBuffer();

    await this.filerService.write(folderPath, name, buffer);

    return name;
  }

  async delete(avatar: string) {
    this.loggerService.debug(`Delete avatar : ${avatar}`);
    const folderPath = '/usr/src/app/storage/avatars';

    await this.filerService.delete(folderPath, avatar);
  }
}
