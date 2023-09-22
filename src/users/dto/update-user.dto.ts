import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
  IsMobilePhone,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

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

  @IsDefined()
  @IsDate()
  @Type(() => Date)
  birth_date: Date;

  @IsOptional()
  @MaxLength(512)
  bio: string;

  @IsOptional()
  @IsArray()
  languages: Array<number>;

  @IsOptional()
  @IsArray()
  interests: Array<number>;
}
