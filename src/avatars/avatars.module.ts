import { Module } from '@nestjs/common';
import { FilerModule } from 'src/filer/filer.module';
import { LoggerModule } from 'src/logger/logger.module';
import { AvatarsService } from './avatars.service';

@Module({
  imports: [LoggerModule, FilerModule],
  providers: [AvatarsService],
  exports: [AvatarsService],
})
export class AvatarsModule {}
