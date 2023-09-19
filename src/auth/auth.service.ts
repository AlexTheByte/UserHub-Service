import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ICreateAuth } from './interfaces/create-auth.interface';
import * as bcrypt from 'bcrypt';
import { IUpdateAuth } from './interfaces/update-auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authsRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  /**
   * Find user by email
   * @param email
   * @returns user
   */
  async findByEmail(email: string): Promise<Auth> {
    return await this.authsRepository.findOne({
      where: { email },
    });
  }

  /**
   * Find user by email
   * @param email
   * @returns user
   */
  async findByResetPasswordToken(reset_password_token: string): Promise<Auth> {
    return await this.authsRepository.findOne({
      where: { reset_password_token },
    });
  }

  /**
   * Find user by email
   * @param email
   * @returns user
   */
  async findByUser(user: User): Promise<Auth> {
    return await this.authsRepository.findOne({
      where: { user },
    });
  }

  /**
   * Validate the email and password of the user
   * @param email
   * @param password
   * @returns Promise<Auth | null>
   */
  async validate(email: string, password: string): Promise<Auth | null> {
    const auth = await this.authsRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!auth || !(await bcrypt.compare(password, auth.password))) {
      throw new UnauthorizedException();
    }

    return auth;
  }

  /**
   * Create a new Jwt Token for the user
   * @param user
   * @returns Jwt Token
   */
  async login(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      user_updated_at: user.updated_at,
      user_created_at: user.created_at,
    };
    return await this.jwtService.sign(payload);
  }

  /**
   * Create a forgot password token
   * @param auth
   * @returns forgot password token
   */
  async forgotPassword(auth: Auth): Promise<string> {
    const payload = {
      sub: auth.id,
      auth_updated_at: auth.updated_at,
      auth_created_at: auth.created_at,
    };
    auth.reset_password_token = await this.jwtService.sign(payload);
    await this.authsRepository.save(auth);

    return auth.reset_password_token;
  }

  /**
   * Verify if the user is valid and not expired
   * @param token
   * @returns Promise<boolean>
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return !!decoded;
    } catch (error) {
      // Invalide token or expired
      return false;
    }
  }

  /**
   * Create the auth related to the user
   * @param user
   * @param auth
   * @returns the user
   */
  async create(user: User, auth: ICreateAuth) {
    return await this.authsRepository.save({
      user,
      email: auth.email,
      password: await bcrypt.hash(auth.password, 10),
    });
  }

  /**
   * Remove the auth of the user
   * @param auth
   * @returns delete result
   */
  async remove(auth: Auth) {
    return await this.authsRepository.remove(auth);
  }

  /**
   * Update the password
   * @param user
   * @param authUpdate
   * @returns update result
   */
  async update(auth: Auth, authUpdate: IUpdateAuth) {
    // Reset password
    if (!!authUpdate.new_nassword && !authUpdate.old_password) {
      auth.password = await bcrypt.hash(authUpdate.new_nassword, 10);
      return await this.authsRepository.save(auth);
    }

    // Email
    if (!!authUpdate.email) {
      auth.email = authUpdate.email;
    }

    // New password
    if (!!authUpdate.new_nassword && !!authUpdate.old_password) {
      await this.validate(auth.email, authUpdate.old_password);
      auth.password = await bcrypt.hash(authUpdate.new_nassword, 10);
    }

    return await this.authsRepository.save(auth);
  }
}
