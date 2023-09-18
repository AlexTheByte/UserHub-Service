import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ResponseDto } from '@travel-1/travel-sdk';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<ResponseDto<string>> {
    const token = await this.authService.login(req.user);
    return AuthResponseDto.create(token);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  async update(@Request() req, @Body() updateAuthDto: UpdateAuthDto): Promise<object> {
    await this.authService.update(req.user, updateAuthDto);
    return {};
  }

  // TODO : Ajouter l'endpoint pour l'envoi de mail pour reset password
}
