import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, FindOptionsWhere, In, Repository } from 'typeorm';
import { ICreateUser } from './interfaces/create-user.interface';
import { IUpdateUser } from './interfaces/update-user.interface';
import { CustomLoggerService } from '@travel-1/travel-sdk';

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

  async findByIds(ids: Array<number>): Promise<User[]> {
    return await this.usersRepository.findBy({ id: In(ids) });
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOneByOrFail({ id });
  }

  async update(user: User, updateUserDto: IUpdateUser): Promise<User> {
    // First name
    if (!!updateUserDto.first_name) {
      user.first_name = updateUserDto.first_name;
    }

    // Last name
    if (!!updateUserDto.last_name) {
      user.last_name = updateUserDto.last_name;
    }

    // Birth date
    if (!!updateUserDto.birth_date) {
      user.birth_date = updateUserDto.birth_date;
    }

    // Bio
    if (!!updateUserDto.bio) {
      user.bio = updateUserDto.bio;
    }

    // Avatar
    if (!!updateUserDto.avatar) {
      user.avatar = updateUserDto.avatar;
    }

    // Mobile phone
    if (!!updateUserDto.mobile_phone) {
      user.mobile_phone = updateUserDto.mobile_phone;
    }

    // Languages
    if (!!updateUserDto.languages) {
      user.languages = updateUserDto.languages;
    }

    // Interests
    if (!!updateUserDto.interests) {
      user.interests = updateUserDto.interests;
    }

    return await this.usersRepository.save(user);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async findBy(where: FindOptionsWhere<User>): Promise<User[]> {
    return await this.usersRepository.findBy(where);
  }
}
