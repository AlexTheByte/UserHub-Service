import { ResponseDto } from '@travel-1/travel-sdk';

export class AuthResponseDto extends ResponseDto<string> {
  access_token: string;

  constructor(access_token: string) {
    super(access_token);

    this.access_token = access_token;
  }
}
