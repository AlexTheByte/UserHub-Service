import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(5)
  old_password?: string;

  @IsOptional()
  @MinLength(5)
  new_password?: string;
}
