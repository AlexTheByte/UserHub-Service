import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, FindOptionsWhere, In, Repository, UpdateResult } from 'typeorm';
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

  async find(ids: Array<number>): Promise<User[]> {
    return await this.usersRepository.findBy({ id: In(ids) });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateUserDto: IUpdateUser): Promise<UpdateResult> {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async findBy(where: FindOptionsWhere<User>): Promise<User[]> {
    console.log(where);
    return await this.usersRepository.findBy(where);
  }
}
