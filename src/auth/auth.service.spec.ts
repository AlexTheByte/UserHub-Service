import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ICreateAuth } from './interfaces/create-auth.interface';
import { IUpdateAuth } from './interfaces/update-auth.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockAuthRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.created_at = new Date('2022-01-01T00:00:00Z');
  mockUser.updated_at = new Date('2022-01-01T00:00:00Z');

  const mockAuth = new Auth();
  mockAuth.id = 1;
  mockAuth.created_at = new Date('2022-01-01T00:00:00Z');
  mockAuth.updated_at = new Date('2022-01-01T00:00:00Z');
  mockAuth.user = mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: mockAuthRepository,
        },
      ],
      imports: [JwtModule],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find an auth by email', async () => {
      mockAuthRepository.findOne.mockResolvedValue(mockAuth);

      const result = await authService.findByEmail('test@example.com');

      expect(result).toEqual(mockAuth);
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when no auth is found', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);

      const result = await authService.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
    });
  });

  describe('findByResetPasswordToken', () => {
    it('should find an auth by reset password token', async () => {
      mockAuthRepository.findOne.mockResolvedValue(mockAuth);

      const result = await authService.findByResetPasswordToken('validToken123');

      expect(result).toEqual(mockAuth);
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { reset_password_token: 'validToken123' },
      });
    });

    it('should return null when no auth is found', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);

      const result = await authService.findByResetPasswordToken('invalidToken123');

      expect(result).toBeNull();
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { reset_password_token: 'invalidToken123' },
      });
    });
  });

  describe('findByUser', () => {
    it('should find an auth by user', async () => {
      mockAuthRepository.findOne.mockResolvedValue(mockAuth);

      const result = await authService.findByUser(mockUser);

      expect(result).toEqual(mockAuth);
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser },
      });
    });

    it('should return null when no auth is found', async () => {
      mockAuthRepository.findOne.mockResolvedValue(null);

      const result = await authService.findByUser(mockUser);

      expect(result).toBeNull();
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { user: mockUser },
      });
    });
  });

  describe('validate', () => {
    it('should validate user credentials and return auth', async () => {
      const mockEmail = 'test@example.com';
      const mockPassword = 'password123';
      const hashedPassword = await bcrypt.hash(mockPassword, 10);

      const mockAuth = {
        email: mockEmail,
        password: hashedPassword,
        user: mockUser,
      };

      mockAuthRepository.findOne.mockResolvedValue(mockAuth);

      const result = await authService.validate(mockEmail, mockPassword);

      expect(result).toEqual(mockAuth);
      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        relations: ['user'],
      });
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      const mockEmail = 'test@example.com';
      const mockPassword = 'password123';
      const invalidPassword = 'invalidpassword';

      const mockAuth = {
        email: mockEmail,
        password: await bcrypt.hash(mockPassword, 10),
        user: mockUser,
      };

      mockAuthRepository.findOne.mockResolvedValue(mockAuth);

      await expect(authService.validate(mockEmail, invalidPassword)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        relations: ['user'],
      });
    });

    it('should throw UnauthorizedException when no auth is found', async () => {
      const mockEmail = 'test@example.com';
      const mockPassword = 'password123';

      mockAuthRepository.findOne.mockResolvedValue(null);

      await expect(authService.validate(mockEmail, mockPassword)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockEmail },
        relations: ['user'],
      });
    });
  });

  describe('login', () => {
    it('should create a new Jwt Token for the user', async () => {
      const user = new User();
      user.id = 1;
      user.updated_at = new Date();
      user.created_at = new Date();

      const mockJwtToken = 'mockJwtToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken);

      const result = await authService.login(user);

      expect(result).toEqual(mockJwtToken);
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should create a forgot password token', async () => {
      const mockAuth = {
        id: 1,
        updated_at: new Date(),
        created_at: new Date(),
        reset_password_token: null,
      };
      const auth = new Auth();
      auth.id = 1;
      auth.updated_at = new Date();
      auth.created_at = new Date();
      auth.reset_password_token = null;

      const mockPayload = {
        sub: mockAuth.id,
        auth_updated_at: mockAuth.updated_at,
        auth_created_at: mockAuth.created_at,
      };

      const mockResetPasswordToken = 'mockResetPasswordToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(mockResetPasswordToken);
      mockAuthRepository.save.mockResolvedValue(mockAuth);

      const result = await authService.forgotPassword(auth);

      expect(result).toEqual(mockResetPasswordToken);
      expect(jwtService.sign).toHaveBeenCalledWith(mockPayload);
      expect(mockAuthRepository.save).toHaveBeenCalledWith({
        ...mockAuth,
        reset_password_token: mockResetPasswordToken,
      });
    });
  });

  describe('verifyToken', () => {
    it('should return true for a valid token', async () => {
      const mockToken = 'validToken';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({}); // Utilisez un objet vide pour simuler un décodage réussi

      const result = await authService.verifyToken(mockToken);

      expect(result).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockToken);
    });

    it('should return false for an invalid or expired token', async () => {
      const mockToken = 'invalidToken';

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid or expired token'));

      const result = await authService.verifyToken(mockToken);

      expect(result).toBe(false);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockToken);
    });
  });

  describe('create', () => {
    it('should create an auth record for the user', async () => {
      const mockUser = new User();
      const mockCreateAuth: ICreateAuth = {
        email: 'test@example.com',
        password: 'password123',
      };

      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      const authsRepositorySaveSpy = jest.spyOn(mockAuthRepository, 'save').mockResolvedValue({});

      const result = await authService.create(mockUser, mockCreateAuth);

      expect(bcryptHashSpy).toHaveBeenCalledWith(mockCreateAuth.password, 10);
      expect(authsRepositorySaveSpy).toHaveBeenCalledWith({
        user: mockUser,
        email: mockCreateAuth.email,
        password: 'hashedPassword',
      });

      expect(result).toEqual({});
    });
  });

  describe('remove', () => {
    it('should remove the auth record', async () => {
      const mockAuth = new Auth(); // Créez un objet Auth fictif pour les tests

      const authsRepositoryRemoveSpy = jest
        .spyOn(mockAuthRepository, 'remove')
        .mockResolvedValue({});

      const result = await authService.remove(mockAuth);

      expect(authsRepositoryRemoveSpy).toHaveBeenCalledWith(mockAuth);
      expect(result).toEqual({}); // Remplacez {} par le résultat attendu
    });
  });

  describe('update', () => {
    it('should update the auth record with a new password', async () => {
      const mockAuth = new Auth();
      const mockAuthUpdate: IUpdateAuth = {
        old_password: 'oldPassword',
        new_nassword: 'newPassword',
      };

      jest.spyOn(mockAuthRepository, 'findOne').mockResolvedValue(mockAuth);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const authsRepositorySaveSpy = jest
        .spyOn(mockAuthRepository, 'save')
        .mockResolvedValue(mockAuth);

      jest.spyOn(authService, 'validate').mockResolvedValue(mockAuth);
      await authService.update(mockAuth, mockAuthUpdate);

      expect(authsRepositorySaveSpy).toHaveBeenCalledWith(mockAuth);
    });

    it('should update the auth record with a new email', async () => {
      const mockAuth = new Auth();
      const mockAuthUpdate: IUpdateAuth = {
        email: 'newEmail@example.com',
      };

      const authsRepositorySaveSpy = jest
        .spyOn(mockAuthRepository, 'save')
        .mockResolvedValue(mockAuth);

      const result = await authService.update(mockAuth, mockAuthUpdate);

      expect(mockAuth.email).toEqual(mockAuthUpdate.email);
      expect(authsRepositorySaveSpy).toHaveBeenCalledWith(mockAuth);
      expect(result).toEqual(mockAuth);
    });

    it('should throw an exception if old password is invalid', async () => {
      const mockAuth = new Auth();
      const mockAuthUpdate: IUpdateAuth = {
        old_password: 'invalidPassword',
        new_nassword: 'newPassword',
      };

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      try {
        await authService.update(mockAuth, mockAuthUpdate);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
