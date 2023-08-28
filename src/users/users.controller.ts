import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { TravelJobQueue } from 'src/enums/travel-job-queue.enums';
import { Queue } from 'bull';
import { UserJobType } from 'src/enums/user-job-type.enums';
import ResponseDto from 'src/dto/response.dto';
import { User } from './entities/user.entity';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectQueue(TravelJobQueue.User) private readonly usersJobsQueue: Queue,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersJobsQueue.add(UserJobType.Create, createUserDto);
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<ResponseDto<User>> {
    const user = await this.usersService.findOne(req.user.id);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<ResponseDto<User[]>> {
    const users = await this.usersService.findAll();
    return UserResponseDto.create(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseDto<User>> {
    const user = await this.usersService.findOne(id);
    return UserResponseDto.create(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    await this.usersJobsQueue.add(UserJobType.Update, updateUserDto);
    return {};
  }
}
