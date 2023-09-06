import { MessagePattern } from '@nestjs/microservices';
import { ResponseDto } from '@travel-1/travel-sdk';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { Controller } from '@nestjs/common';
import { FindOperator, FindOptionsWhere } from 'typeorm';

@Controller()
export class UserRpcConsumer {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users')
  async users(where: FindOptionsWhere<User>): Promise<ResponseDto<User>> {
    const id = new FindOperator(where['id']['_type'], where['id']['_value']);
    const users = await this.usersService.findBy({ id });
    return UserResponseDto.create(users);
  }
}
