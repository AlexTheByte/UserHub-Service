import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersJobsConsumer } from 'src/users/users-jobs.consumer';
import { BullModule } from '@nestjs/bull';
import { TravelJobQueue } from 'src/enums/travel-jobs-queue.enums';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: TravelJobQueue.Users,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersJobsConsumer],
  exports: [UsersService],
})
export class UsersModule {}
