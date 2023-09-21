import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ICreateUser } from './interfaces/create-user.interface';
import { LoggerModule } from '@travel-1/travel-sdk';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Utilisation d'une classe de mock pour le Repository
        },
      ],
      imports: [LoggerModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: ICreateUser = {
      mobile_phone: '+33633756390',
      first_name: 'first_name',
      last_name: 'last_name',
      birth_date: new Date('1991-05-19T00:00:00.000Z'),
    };

    const user = new User();
    userRepository.save = jest.fn().mockResolvedValue(user);

    const result = await service.create(createUserDto);

    expect(result).toEqual(user);
    expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
  });
});
