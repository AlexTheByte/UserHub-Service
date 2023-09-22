import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { ICreateUser } from './interfaces/create-user.interface';
import { LoggerModule } from '@travel-1/travel-sdk';
import { IUpdateUser } from './interfaces/update-user.interface';

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

  it('should update a user', async () => {
    const updateUserDto: IUpdateUser = {
      mobile_phone: '+33612345678',
      first_name: 'first_name',
      last_name: 'last_name',
      birth_date: new Date('1991-05-19T00:00:00.000Z'),
      bio: 'bio',
      avatar: 'filename.jpeg',
      languages: [1, 2],
      interests: [1, 2],
    };

    const user = new User();
    userRepository.save = jest.fn().mockResolvedValue(user);

    const result = await service.update(user, updateUserDto);

    expect(userRepository.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);

    expect(user.mobile_phone).toEqual(updateUserDto.mobile_phone);
    expect(user.first_name).toEqual(updateUserDto.first_name);
    expect(user.last_name).toEqual(updateUserDto.last_name);
    expect(user.birth_date).toEqual(updateUserDto.birth_date);
    expect(user.bio).toEqual(updateUserDto.bio);
    expect(user.avatar).toEqual(updateUserDto.avatar);
    expect(user.languages).toEqual(updateUserDto.languages);
    expect(user.interests).toEqual(updateUserDto.interests);
  });

  it('should delete a user', async () => {
    const userId = 1;

    // Configure le comportement du repository mocké
    userRepository.delete = jest.fn().mockResolvedValue({ affected: 1 } as DeleteResult);

    // Appel de la fonction delete du service
    const deleteResult = await service.delete(userId);

    // Vérifiez que la fonction delete du repository mocké a été appelée avec l'ID utilisateur
    expect(userRepository.delete).toHaveBeenCalledWith(userId);

    // Vérifiez que la fonction renvoie le résultat de la suppression
    expect(deleteResult).toEqual({ affected: 1 });
  });

  it('should find user by id', async () => {
    const userId = 1;

    const expectedUser: User = new User();

    userRepository.findOneByOrFail = jest.fn().mockResolvedValue(expectedUser);

    const user = await service.findOneById(userId);

    expect(userRepository.findOneByOrFail).toHaveBeenCalledWith({ id: userId });

    expect(user).toEqual(expectedUser);
  });

  it('should find users by ids', async () => {
    const userIds = [1, 2, 3];

    const expectedUsers: User[] = [new User()];

    userRepository.findBy = jest.fn().mockResolvedValue(expectedUsers);

    const users = await service.findByIds(userIds);

    expect(userRepository.findBy).toHaveBeenCalledWith({ id: In(userIds) });

    expect(users).toEqual(expectedUsers);
  });

  it('should find users by where', async () => {
    const where = { id: 1 };

    const expectedUser: User = new User();

    userRepository.findBy = jest.fn().mockResolvedValue(expectedUser);

    const user = await service.findBy(where);

    expect(userRepository.findBy).toHaveBeenCalledWith(where);

    expect(user).toEqual(expectedUser);
  });
});
