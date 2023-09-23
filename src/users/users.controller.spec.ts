import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AvatarsService } from 'src/avatars/avatars.service';
import {
  CustomLoggerService,
  EventTravel,
  EventTypeUser,
  LoggerModule,
} from '@travel-1/travel-sdk';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { ICreateUser } from './interfaces/create-user.interface';
import { ICreateAuth } from 'src/auth/interfaces/create-auth.interface';
import { Auth } from 'src/auth/entities/auth.entity';
import * as _ from 'lodash';
import { Readable } from 'stream';
import { IUpdateUser } from './interfaces/update-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;
  let avatarsService: AvatarsService;
  let eventClient: ClientProxy;
  const _FAKE_FILE_CONTENT = {
    fieldname: 'Fieldname',
    originalname: 'Originalname.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: 12345,
    destination: '/uploads',
    filename: 'filename.txt',
    path: '/uploads/filename.txt',
    stream: Readable.from('StreamContent'),
    buffer: Buffer.from('BufferContent', 'utf-8'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findBy: jest.fn(),
            findByIds: jest.fn(),
            findOneById: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            findByEmail: jest.fn(),
            findByResetPasswordToken: jest.fn(),
            findByUser: jest.fn(),
            validate: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            verifyToken: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: AvatarsService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: CustomLoggerService, useValue: [] },
        {
          provide: 'REDIS_EVENT_CLIENT',
          useValue: { emit: jest.fn() },
        },
      ],
      imports: [LoggerModule],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    avatarsService = module.get<AvatarsService>(AvatarsService);
    eventClient = module.get<ClientProxy>('REDIS_EVENT_CLIENT');
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.test',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe',
        mobile_phone: '1234567890',
        birth_date: new Date(),
      };

      const userInfo: ICreateUser = _.pick(createUserDto, [
        'first_name',
        'last_name',
        'mobile_phone',
        'birth_date',
      ]);

      const authInfo: ICreateAuth = _.pick(createUserDto, ['email', 'password']);

      const user = new User();
      const auth = new Auth();

      usersService.create = jest.fn().mockResolvedValue(user);
      authService.create = jest.fn().mockResolvedValue(auth);

      const result = await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(userInfo);
      expect(authService.create).toHaveBeenCalledWith(user, authInfo);

      expect(result).toEqual({});
    });
  });

  describe('me', () => {
    it('should return user', async () => {
      const reqParam = { user: { id: 0 } };
      const user = new User();

      usersService.findOneById = jest.fn().mockResolvedValue(user);

      const result = await usersController.me(reqParam);

      expect(usersService.findOneById).toHaveBeenCalledWith(reqParam.user.id);

      expect(result).toEqual(user);
    });
  });

  describe('avatar', () => {
    it('should update avatar', async () => {
      const finalFileName = 'generated-file-name.jpeg';
      const user = new User();
      user.avatar = 'file.jpeg';

      const reqParam = { user };

      jest.spyOn(avatarsService, 'delete').mockResolvedValue();
      jest.spyOn(avatarsService, 'create').mockResolvedValue(finalFileName);
      jest.spyOn(usersService, 'update');

      const result = await usersController.avatar(reqParam, _FAKE_FILE_CONTENT);

      expect(avatarsService.delete).toHaveBeenCalled();
      expect(avatarsService.create).toHaveBeenCalled();
      expect(usersService.update).toHaveBeenCalled();

      expect(result).toEqual({});
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateUserDto: UpdateUserDto = {
        mobile_phone: '1234567890',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: new Date(),
        bio: 'Test',
        languages: [1, 2],
        interests: [1, 2],
      };

      const updatedUser = new User();
      updatedUser.mobile_phone = updateUserDto.mobile_phone;
      updatedUser.first_name = updateUserDto.first_name;
      updatedUser.last_name = updateUserDto.last_name;
      updatedUser.birth_date = updateUserDto.birth_date;
      updatedUser.bio = updateUserDto.bio;
      updatedUser.languages = updateUserDto.languages;
      updatedUser.interests = updateUserDto.interests;

      const reqPrm = { user: updatedUser };

      jest.spyOn(usersService, 'update').mockResolvedValue(updatedUser);

      jest.spyOn(eventClient, 'emit');

      const updateResult = await usersController.update(reqPrm, updateUserDto);

      expect(usersService.update).toHaveBeenCalled();
      expect(eventClient.emit).toHaveBeenCalledWith(
        `${EventTravel.User}:${EventTypeUser.Update}`,
        updatedUser,
      );

      expect(updateResult).toEqual(UserResponseDto.create(updatedUser));
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const user = new User();
      user.id = 1;
      user.avatar = 'avatar';

      const reqPrm = { user: user };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(user);
      jest.spyOn(avatarsService, 'delete');
      jest.spyOn(usersService, 'delete');

      const updateResult = await usersController.delete(reqPrm);

      expect(avatarsService.delete).toHaveBeenCalled();
      expect(usersService.delete).toHaveBeenCalled();

      expect(updateResult).toEqual({});
    });
  });
});
