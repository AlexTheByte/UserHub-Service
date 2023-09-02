import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUpdateUser } from './interfaces/update-user.interface';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly loggerService: CustomLoggerService,
  ) {}

  async create(user: ICreateUser): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(userId: number): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id: userId });
  }

  async update(userId: number, updateUserDto: IUpdateUser): Promise<UpdateResult> {
    return await this.usersRepository.update(userId, updateUserDto);
  }

  async delete(userId: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(userId);
  }
}
