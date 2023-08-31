import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import ResponseDto from 'src/dto/response.dto';
import AuthResponseDto from './dto/auth-response.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<ResponseDto<string>> {
    const token = await this.authService.login(req.user);
    return AuthResponseDto.create(token);
  }
}
