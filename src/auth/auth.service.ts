import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authsRepository: Repository<Auth>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validate(email: string, pass: string): Promise<any> {
    const auth = await this.authsRepository.findOne({ where: { email: email }, relations: ['user'] });

    if (auth && auth.password === pass) {
      return auth.user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createAuthDto: CreateAuthDto) {
    const user = await this.usersService.create({ firstName: createAuthDto.firstName, lastName: createAuthDto.lastName });
    await this.authsRepository.save({ user: user, email: createAuthDto.email, password: createAuthDto.password });

    return user;
  }
}
