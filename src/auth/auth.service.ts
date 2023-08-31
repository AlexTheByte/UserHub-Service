import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ICreateAuth } from './interfaces/create-auth.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authsRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async validate(email: string, password: string): Promise<any> {
    const auth = await this.authsRepository.findOne({
      where: { email: email },
      relations: ['user'],
    });

    if (auth && (await bcrypt.compare(password, auth.password))) {
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

  async create(user: User, auth: ICreateAuth) {
    return await this.authsRepository.save({
      user: user,
      email: auth.email,
      password: await bcrypt.hash(auth.password, 10),
    });
  }
}
