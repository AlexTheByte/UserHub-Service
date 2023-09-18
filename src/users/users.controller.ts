import {
  Controller,
  Get,
  Body,
  UseGuards,
  Request,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JobTravel } from '@travel-1/travel-sdk';
import { JobTypeUser } from '@travel-1/travel-sdk';
import { User } from './entities/user.entity';
import { ResponseDto } from '@travel-1/travel-sdk';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarsService } from 'src/avatars/avatars.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly avatarsService: AvatarsService,
    private readonly usersService: UsersService,
    @InjectQueue(JobTravel.User) private readonly usersJobsQueue: Queue,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<object> {
    await this.usersJobsQueue.add(JobTypeUser.Create, createUserDto);
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<ResponseDto<User>> {
    const user = await this.usersService.findOneById(req.user.id);
    return UserResponseDto.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('avatar'))
  async avatar(@Request() req, @UploadedFile() avatar: Express.Multer.File): Promise<object> {
    const user = await this.usersService.findOneById(req.user.id);

    if (!!user.avatar) {
      await this.avatarsService.delete(user.avatar);
    }

    const avatarName = await this.avatarsService.create(avatar);

    await this.usersService.update(req.user.id, { avatar: avatarName });

    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Request() req): Promise<object> {
    // TODO : Faire la gestion de l'update
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req): Promise<object> {
    const user = await this.usersService.findOneById(req.user.id);

    if (!!user.avatar) {
      await this.avatarsService.delete(user.avatar);
    }

    await this.usersService.delete(req.user.id);
    return {};
  }
}
