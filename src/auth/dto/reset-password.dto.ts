import { IsDefined, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsDefined()
  @IsString()
  reset_password_token: string;

  @IsDefined()
  @MinLength(5)
  new_password?: string;
}
