import { Module } from '@nestjs/common';
import { FilerService } from './filer.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [FilerService],
  exports: [FilerService],
})
export class FilerModule {}
