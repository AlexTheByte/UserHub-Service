import {
  Controller,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Delete,
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
    const user = await this.usersService.findOne(req.user.id);
    return UserResponseDto.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ResponseDto<User[]>> {
    const users = await this.usersService.findAll();
    return UserResponseDto.create(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) userId: number): Promise<ResponseDto<User>> {
    const user = await this.usersService.findOne(userId);
    return UserResponseDto.create(user);
  }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
  //   await this.usersJobsQueue.add(JobTypeUser.Update, updateUserDto);
  //   return {};
  // }

  // @UseGuards(JwtAuthGuard)
  @Post(':id/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('avatar'))
  async avatar(
    @Param('id', ParseIntPipe) userId: number,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<object> {
    const user = await this.usersService.findOne(userId);

    if (!!user.avatar) {
      await this.avatarsService.delete(user.avatar);
    }

    const avatarName = await this.avatarsService.create(avatar);

    await this.usersService.update(userId, { avatar: avatarName });

    return {};
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) userId: number): Promise<object> {
    const user = await this.usersService.findOne(userId);

    if (!!user.avatar) {
      await this.avatarsService.delete(user.avatar);
    }

    await this.usersService.delete(userId);
    return {};
  }
}
