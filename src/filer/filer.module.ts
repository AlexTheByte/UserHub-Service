import { Module } from '@nestjs/common';
import { FilerService } from './filer.service';
import { LoggerModule } from '@travel-1/travel-sdk';

@Module({
  imports: [LoggerModule],
  providers: [FilerService],
  exports: [FilerService],
})
export class FilerModule {}
