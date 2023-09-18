import { IsDefined, IsEmail, IsMobilePhone, Length } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsMobilePhone()
  mobile_phone: string;

  @IsDefined()
  password: string;

  @Length(2, 40)
  @IsDefined()
  first_name: string;

  @Length(2, 40)
  @IsDefined()
  last_name: string;
}
