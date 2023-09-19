import { IsDefined, IsEmail, IsMobilePhone, IsOptional, Length, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsMobilePhone()
  mobile_phone: string;

  @IsOptional()
  @Length(2, 40)
  first_name: string;

  @IsOptional()
  @Length(2, 40)
  last_name: string;

  @IsOptional()
  @MaxLength(512)
  bio: string;
}
