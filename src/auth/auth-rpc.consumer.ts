import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthRpcConsumer {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth')
  async auth(token: any): Promise<boolean> {
    const assertion = await this.authService.verifyToken(token);
    return assertion;
  }
}
