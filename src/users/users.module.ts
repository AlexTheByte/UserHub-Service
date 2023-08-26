import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersJobsConsumer } from 'src/users/users-jobs.consumer';
import { UsersEventsConsumer } from './users-events.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: 'users',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersJobsConsumer, UsersEventsConsumer],
  exports: [UsersService],
})
export class UsersModule {}
