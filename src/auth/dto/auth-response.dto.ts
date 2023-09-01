import { ResponseDto } from 'src/dto/response.dto';

export class AuthResponseDto extends ResponseDto<string> {
  access_token: string;

  constructor(access_token: string) {
    super(access_token);

    this.access_token = access_token;
  }
}
