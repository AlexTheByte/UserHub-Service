import { Module } from '@nestjs/common';
import { FilerModule } from '@travel-1/travel-sdk';
import { LoggerModule } from '@travel-1/travel-sdk';
import { AvatarsService } from './avatars.service';

@Module({
  imports: [LoggerModule, FilerModule],
  providers: [AvatarsService],
  exports: [AvatarsService],
})
export class AvatarsModule {}
