import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseDto } from '@travel-1/travel-sdk';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a ResponseDto<string> containing a token', async () => {
      const mockUser = {}; // Mock your user object here
      const mockToken = 'mockToken'; // Mock the token here

      jest.spyOn(authService, 'login').mockImplementation(async () => mockToken);

      const result: ResponseDto<string> = await authController.login({
        user: mockUser, // Mock the user object as it would be in your LocalAuthGuard
      });

      expect(result).toBeDefined();
      expect(result.data).toEqual(mockToken);
    });
  });
});
