import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AvatarsService } from 'src/avatars/avatars.service';
import { CustomLoggerService, LoggerModule } from '@travel-1/travel-sdk';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { ICreateUser } from './interfaces/create-user.interface';
import { ICreateAuth } from 'src/auth/interfaces/create-auth.interface';
import { Auth } from 'src/auth/entities/auth.entity';
import * as _ from 'lodash';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;
  let avatarsService: AvatarsService;
  let eventClient: ClientProxy;

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
      const reqParam = { user: { id: 0 } };
      const user = new User();

      usersService.findOneById = jest.fn().mockResolvedValue(user);

      const result = await usersController.me(reqParam);

      expect(usersService.findOneById).toHaveBeenCalledWith(reqParam.user.id);

      expect(result).toEqual(user);
    });
  });
});
