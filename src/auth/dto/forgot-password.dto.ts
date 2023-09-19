import { IsDefined, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsDefined()
  @IsEmail()
  email: string;
}
