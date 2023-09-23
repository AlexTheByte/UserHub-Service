import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsService } from './avatars.service';
import { CustomLoggerService } from '@travel-1/travel-sdk';
import { FilerService } from '@travel-1/travel-sdk';
import * as sharp from 'sharp';
import { Readable } from 'stream';

describe('AvatarsService', () => {
  let avatarsService: AvatarsService;
  let filerService: FilerService;

  const mockAvatarFile: Express.Multer.File = {
    fieldname: 'Fieldname',
    originalname: 'Originalname.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: 12345,
    destination: '/uploads',
    filename: 'filename.txt',
    path: '/uploads/filename.txt',
    stream: Readable.from('StreamContent'),
    buffer: Buffer.from('BufferContent', 'utf-8'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarsService,
        {
          provide: CustomLoggerService,
          useValue: {
            debug: jest.fn(),
          },
        },
        {
          provide: FilerService,
          useValue: {
            write: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    avatarsService = module.get<AvatarsService>(AvatarsService);
    filerService = module.get<FilerService>(FilerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new avatar', async () => {
      const mockBuffer = Buffer.from('MockImageData');
      const sharpResizeSpy = jest.spyOn(sharp.prototype, 'resize').mockReturnThis();
      const sharpJpegSpy = jest.spyOn(sharp.prototype, 'jpeg').mockReturnThis();
      const sharpToBufferSpy = jest
        .spyOn(sharp.prototype, 'toBuffer')
        .mockResolvedValue(mockBuffer);

      await avatarsService.create(mockAvatarFile);

      expect(sharpResizeSpy).toHaveBeenCalledWith({ width: 300, height: 300 });
      expect(sharpJpegSpy).toHaveBeenCalledWith({ quality: 80 });
      expect(sharpToBufferSpy).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an avatar', async () => {
      const mockAvatarName = 'mock-avatar.jpg';
      const filerServiceDeleteSpy = jest.spyOn(filerService, 'delete').mockResolvedValue();

      await avatarsService.delete(mockAvatarName);

      expect(filerServiceDeleteSpy).toHaveBeenCalledWith(
        '/usr/src/app/storage/avatars',
        mockAvatarName,
      );
    });
  });
});
