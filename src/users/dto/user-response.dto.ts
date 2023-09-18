import { ResponseDto } from '@travel-1/travel-sdk';
import { User } from '../entities/user.entity';

export class UserResponseDto extends ResponseDto<User> {
  first_name: string;
  last_name: string;
  avatar: string;

  constructor(user: User) {
    super(user);

    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.avatar = user.avatar;
  }
}
