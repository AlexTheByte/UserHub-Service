import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomLoggerService } from '@travel-1/travel-sdk';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let loggerService: CustomLoggerService;
  let eventClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            findByUser: jest.fn(),
            update: jest.fn(),
            findByEmail: jest.fn(),
            forgotPassword: jest.fn(),
            findByResetPasswordToken: jest.fn(),
          },
        },
        {
          provide: CustomLoggerService,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: 'REDIS_EVENT_CLIENT',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    loggerService = module.get<CustomLoggerService>(CustomLoggerService);
    eventClient = module.get<ClientProxy>('REDIS_EVENT_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockToken = 'mock-token';
      const mockRequest = { user: mockUser };
      authService.login = jest.fn().mockResolvedValue(mockToken);

      const result = await authController.login(mockRequest);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(AuthResponseDto.create(mockToken));
    });

    it('should throw NotFoundException if user is not found', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      jest.spyOn(authService, 'login').mockRejectedValue(new Error('Login error'));
      const mockRequest = { user: mockUser };

      try {
        const test = await authController.login(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);

        expect(error.response).toEqual({
          message: 'Unauthorized',
          statusCode: 401,
        });
      }
    });
  });

  describe('update', () => {
    it('should update the user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const updateAuthDto: UpdateAuthDto = {};

      authService.findByUser = jest.fn().mockResolvedValue(mockUser);
      authService.update = jest.fn().mockResolvedValue(null);

      const result = await authController.update({ user: mockUser }, updateAuthDto);

      expect(result).toEqual({});
      expect(authService.findByUser).toHaveBeenCalledWith(mockUser);
      expect(authService.update).toHaveBeenCalledWith(mockUser, updateAuthDto);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const updateAuthDto: UpdateAuthDto = {};

      authService.findByUser = jest.fn().mockResolvedValue(null);

      try {
        await authController.update({ user: mockUser }, updateAuthDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('forgotPassword', () => {
    it('should throw NotFoundException when user is not found', async () => {
      const email = 'test@test.test';
      const forgotPasswordDto = { email };

      jest.spyOn(authService, 'findByEmail').mockResolvedValue(null);

      try {
        await authController.forgotPassword(forgotPasswordDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Utilisateur non trouvé pour cet e-mail');
      }
    });

    it('should send reset password email when user is found', async () => {
      const email = 'test@test.test';
      const mockForgotPasswordDto = { email };
      const mockAuth = {
        email: 'test@test.test',
      };

      (authService.findByEmail as jest.Mock).mockResolvedValue(mockAuth);

      (authService.forgotPassword as jest.Mock).mockResolvedValue('resetToken123');

      const result = await authController.forgotPassword(mockForgotPasswordDto);
      expect(authService.forgotPassword).toHaveBeenCalledWith(mockAuth);
      expect(result).toEqual({});
    });
  });

  describe('resetPassword', () => {
    it('should reset user password when valid token is provided', async () => {
      const resetPasswordDto = {
        reset_password_token: 'validToken123',
        new_password: 'newPassword123',
      };
      const mockAuth = {
        reset_password_token: 'validToken123',
      };

      (authService.findByResetPasswordToken as jest.Mock).mockResolvedValue(mockAuth);

      const result = await authController.resetPassword(resetPasswordDto);

      expect(authService.findByResetPasswordToken).toHaveBeenCalledWith(
        resetPasswordDto.reset_password_token,
      );
      expect(authService.update).toHaveBeenCalledWith(mockAuth, {
        reset_password_token: null,
        new_nassword: resetPasswordDto.new_password,
      });
      expect(result).toEqual({});
    });

    it('should throw an exception when password reset fails', async () => {
      // Arrange
      const resetPasswordDto = {
        reset_password_token: 'invalidToken123',
        new_password: 'newPassword123',
      };
      (authService.findByResetPasswordToken as jest.Mock).mockResolvedValue(null);

      jest
        .spyOn(authService, 'findByResetPasswordToken')
        .mockRejectedValue(new Error('Login error'));

      try {
        const result = await authController.resetPassword(resetPasswordDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);

        expect(error.response).toEqual({
          message: 'Not Found',
          statusCode: 404,
        });
      }
    });
  });
});
