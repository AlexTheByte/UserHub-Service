import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ResponseDto } from '@travel-1/travel-sdk';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { FindOptionsWhere } from 'typeorm';
import { UserRpcConsumer } from './users-rpc.consumer';

describe('UserRpcConsumer', () => {
  let userRpcConsumer: UserRpcConsumer;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRpcConsumer],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    userRpcConsumer = module.get<UserRpcConsumer>(UserRpcConsumer);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('users', () => {
    it('should return a ResponseDto<User> with users', async () => {
      const findOptionsWhere: FindOptionsWhere<User> = {}; // Définissez vos options de recherche ici

      const users: User[] = [];

      const expectedResponse: ResponseDto<User> = UserResponseDto.create(users);

      usersService.findBy = jest.fn().mockResolvedValue(users);

      const result = await userRpcConsumer.users(findOptionsWhere);

      expect(usersService.findBy).toHaveBeenCalledWith(findOptionsWhere);

      expect(result).toEqual(expectedResponse);
    });
  });
});
