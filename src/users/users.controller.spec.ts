import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity'; // Assume you have a User entity defined
import { Repository } from 'typeorm';

describe('UsersController', () => {
  let app: TestingModule;
  let usersController: UsersController;
  let userService: UsersService;
  let userRepository: Repository<User>;

  const testData: Partial<User>[] = [
    { first_name: 'first_name', last_name: 'last_name' },
    { first_name: 'first_name', last_name: 'last_name' },
  ];

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite', // Change this to match your DB type
          database: ':memory:', // Use an in-memory database for testing
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    userService = app.get<UsersService>(UsersService);
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await userRepository.clear();

    await userRepository.save(testData);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a all user', async () => {
      const result = await usersController.findAll();
      expect(result).toEqual(testData);
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
