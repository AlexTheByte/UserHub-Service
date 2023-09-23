import { Test, TestingModule } from '@nestjs/testing';
import { AuthRpcConsumer } from './auth-rpc.consumer';
import { AuthService } from './auth.service';

describe('AuthRpcConsumer', () => {
  let authRpcConsumer: AuthRpcConsumer;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthRpcConsumer],
      providers: [
        {
          provide: AuthService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authRpcConsumer = module.get<AuthRpcConsumer>(AuthRpcConsumer);
    authService = module.get<AuthService>(AuthService);
  });

  describe('auth', () => {
    it('should call authService.verifyToken with the provided token', async () => {
      const mockToken = 'mockToken';

      jest.spyOn(authService, 'verifyToken').mockResolvedValue(true);

      const result = await authRpcConsumer.auth(mockToken);

      expect(authService.verifyToken).toHaveBeenCalledWith(mockToken);

      expect(result).toBe(true);
    });
  });
});
