import { MessagePattern } from '@nestjs/microservices';
import { ResponseDto } from '@travel-1/travel-sdk';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { Controller } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { UsersRpcParam } from './users-rpc-param.decorator';

@Controller()
export class UserRpcConsumer {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users')
  async users(
    @UsersRpcParam() findOptionsWhere: FindOptionsWhere<User>,
  ): Promise<ResponseDto<User>> {
    const users = await this.usersService.findBy(findOptionsWhere);
    return UserResponseDto.create(users);
  }
}
