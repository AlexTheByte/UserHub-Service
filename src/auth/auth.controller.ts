import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CustomLoggerService, EventTravel, EventTypeAuth, ResponseDto } from '@travel-1/travel-sdk';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Auth } from './entities/auth.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: CustomLoggerService,
    @Inject('REDIS_EVENT_CLIENT') private readonly eventClient: ClientProxy,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<ResponseDto<string>> {
    try {
      const token = await this.authService.login(req.user);
      return AuthResponseDto.create(token);
    } catch (e) {
      this.loggerService.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  async update(@Request() req, @Body() updateAuthDto: UpdateAuthDto): Promise<object> {
    try {
      const auth = await this.authService.findByUser(req.user);
      await this.authService.update(auth, updateAuthDto);
      return {};
    } catch (e) {
      this.loggerService.error(e.message);
      throw new InternalServerErrorException();
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<object> {
    const auth = await this.authService.findByEmail(forgotPasswordDto.email);

    if (!!auth) {
      try {
        const resetPasswordToken = await this.authService.forgotPassword(auth);

        this.eventClient.emit(`${EventTravel.Auth}:${EventTypeAuth.ForgotPassword}`, {
          email: auth.email,
          resetPasswordToken,
        });
      } catch (e) {
        this.loggerService.error(e.message);
        throw new InternalServerErrorException();
      }
    }

    return {};
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<object> {
    const auth = await this.authService.findByResetPasswordToken(
      resetPasswordDto.reset_password_token,
    );

    if (!!auth) {
      try {
        await this.authService.update(auth, {
          reset_password_token: null,
          new_nassword: resetPasswordDto.new_password,
        });
      } catch (e) {
        this.loggerService.error(e.message);
        throw new InternalServerErrorException();
      }
    }

    return {};
  }
}
