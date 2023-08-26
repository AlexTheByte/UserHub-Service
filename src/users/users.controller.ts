import { Controller, Get, Body, Patch, Param, ParseIntPipe, UseGuards, Request, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { TravelJobQueue } from 'src/enums/travel-jobs-queue.enums';
import { Queue } from 'bull';
import { UsersJobsType } from 'src/enums/users-jobs-type.enums';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  client: ClientProxy;

  constructor(private readonly usersService: UsersService, @InjectQueue(TravelJobQueue.Users) private readonly usersJobsQueue: Queue) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('Request http received');
    await this.client.emit('User:Created', createUserDto);
    // await this.usersJobsQueue.add(UsersJobsType.Creation, createUserDto);
    return 'Ok';
  }

  // @ApiCreatedResponse({
  //   type: CreateTaskResponseDto,
  // })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(req.user.id);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map(user => new UserResponseDto(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
