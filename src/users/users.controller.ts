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
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CustomLoggerService, EventTravel, EventTypeUser } from '@travel-1/travel-sdk';
import { User } from './entities/user.entity';
import { ResponseDto } from '@travel-1/travel-sdk';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarsService } from 'src/avatars/avatars.service';
import { ICreateUser } from './interfaces/create-user.interface';
import { ICreateAuth } from 'src/auth/interfaces/create-auth.interface';
import { AuthService } from 'src/auth/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import * as _ from 'lodash';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReferencesService } from 'src/references/references.service';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly avatarsService: AvatarsService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly loggerService: CustomLoggerService,
    private readonly referencesService: ReferencesService,
    @Inject('REDIS_EVENT_CLIENT') private readonly eventClient: ClientProxy,
  ) {}

  @Get()
  async test() {
    const test = await this.referencesService.findAll('languages');
    console.log(test);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<object> {
    const userInfo: ICreateUser = _.pick(createUserDto, [
      'first_name',
      'last_name',
      'mobile_phone',
      'birth_date',
    ]);
    const authInfo: ICreateAuth = _.pick(createUserDto, ['email', 'password']);

    try {
      const user = await this.usersService.create(userInfo);
      await this.authService.create(user, authInfo);

      this.eventClient.emit(`${EventTravel.User}:${EventTypeUser.Create}`, user);
    } catch (e) {
      this.loggerService.error(e.message);
      throw new InternalServerErrorException();
    }
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
    const user = req.user;
    try {
      if (!!user.avatar) {
        await this.avatarsService.delete(user.avatar);
      }

      const avatarName = await this.avatarsService.create(avatar);

      await this.usersService.update(user, { avatar: avatarName });
    } catch (e) {
      this.loggerService.error(e.message);
      throw new InternalServerErrorException();
    }
    return {};
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<object> {
    try {
      const user = await this.usersService.update(req.user, updateUserDto);
      this.eventClient.emit(`${EventTravel.User}:${EventTypeUser.Update}`, user);
      return UserResponseDto.create(user);
    } catch (e) {
      this.loggerService.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req): Promise<object> {
    const user = await this.usersService.findOneById(req.user.id);
    try {
      if (!!user.avatar) {
        await this.avatarsService.delete(user.avatar);
      }
      await this.usersService.delete(req.user.id);
    } catch (e) {
      this.loggerService.error(e.message);
      throw new InternalServerErrorException();
    }
    return {};
  }
}
