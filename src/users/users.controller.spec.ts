import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity'; // Assume you have a User entity defined
import { Repository } from 'typeorm';
import { JobTravel, LoggerModule } from '@travel-1/travel-sdk';
import { AvatarsModule } from 'src/avatars/avatars.module';
import { AuthModule } from 'src/auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { JwtConfiguration } from 'src/config/jwt.configuration';

describe('UsersController', () => {
  let app: TestingModule;
  let usersController: UsersController;
  let userService: UsersService;
  let userRepository: Repository<User>;

  const testData: Partial<User>[] = [
    { first_name: 'first_name', last_name: 'last_name', mobile_phone: '+33612345678' },
    { first_name: 'first_name', last_name: 'last_name', mobile_phone: '+33612345678' },
  ];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        BullModule.registerQueue({
          name: JobTravel.User,
        }),
        LoggerModule,
        AvatarsModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          validationOptions: {
            allowUnknown: true,
            abortEarly: true,
          },
          load: [JwtConfiguration],
        }),
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    userService = app.get<UsersService>(UsersService);
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {
    await userRepository.clear();

    await userRepository.save(testData);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create an user', async () => {
      const result = await usersController.create({
        email: 'test@test.test',
        mobile_phone: '+33633756390',
        password: 'password',
        first_name: 'first_name',
        last_name: 'last_name',
      });

      expect(result).toEqual({});
    });
  });

  // describe('getUserById', () => {
  //   it('should return a user when given a valid id', async () => {
  //   const allUsers = await userService.findAll(); // You should implement findAll in UserService
  //   const userId = allUsers[0].id; // Get the ID of the first user
  //   const result = await usersController.getUserById(userId);
  //   expect(result).toBeDefined();
  //   expect(result.id).toBe(userId);
  // });
  // it('should return null when given an invalid id', async () => {
  //   const result = await usersController.getUserById('invalidUserId');
  //   expect(result).toBeNull();
  // });
  // });
});
