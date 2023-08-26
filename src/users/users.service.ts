import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TravelJobQueue } from 'src/enums/travel-jobs-queue.enums';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Client, ClientProxy, ClientProxyFactory, ClientRedis, Transport } from '@nestjs/microservices';
import { REDIS_MICROSERVICE } from 'src/event-client.module';

@Injectable()
export class UsersService {
  client: ClientProxy;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // @Inject(REDIS_MICROSERVICE) // private readonly client: ClientProxy,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save(createUserDto);
    // this.client.emit('User:Created', user);

    this.client.emit('User:Created', user);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
