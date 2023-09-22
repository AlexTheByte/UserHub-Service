import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsEmail, IsMobilePhone, Length } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsMobilePhone()
  mobile_phone: string;

  @IsDefined()
  password: string;

  @IsDefined()
  @Length(2, 40)
  first_name: string;

  @IsDefined()
  @Length(2, 40)
  last_name: string;

  @IsDefined()
  @IsDate()
  @Type(() => Date)
  birth_date: Date;
}
