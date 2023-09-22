import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AvatarsService } from 'src/avatars/avatars.service';
import { CustomLoggerService } from '@travel-1/travel-sdk';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;
  let avatarsService: AvatarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthService,
        AvatarsService,
        CustomLoggerService,
        {
          provide: 'REDIS_EVENT_CLIENT', // Le nom de la dépendance
          useValue: eventClientMock, // Utilisez le mock que vous avez créé
        },
        // Autres dépendances nécessaires ici
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    avatarsService = module.get<AvatarsService>(AvatarsService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return an empty object', async () => {
      // Mock data for CreateUserDto
      const createUserDto: CreateUserDto = {
        first_name: 'John',
        last_name: 'Doe',
        mobile_phone: '1234567890',
        birth_date: new Date(),
        // ... other properties
      };

      // Mock data for creating a user
      const createUser: User = {
        id: 1,
        // ... other properties
      };

      // Mock data for CreateAuthDto
      const createAuthDto: CreateAuthDto = {
        email: 'john@example.com',
        password: 'password123',
        // ... other properties
      };

      // Configure behavior of service mocks
      jest.spyOn(usersService, 'create').mockResolvedValue(createUser);
      jest.spyOn(authService, 'create');

      // Call the create method of the controller
      const result = await usersController.create(createUserDto);

      // Assert that the create method of the service was called with the correct data
      expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining(createUserDto));
      expect(authService.create).toHaveBeenCalledWith(
        createUser,
        expect.objectContaining(createAuthDto),
      );

      // Assert that the result is an empty object
      expect(result).toEqual({});
    });
  });

  // Add more test cases for other methods of UsersController if needed
});
