import { ResponseDto } from '@travel-1/travel-sdk';
import { User } from '../entities/user.entity';

export class UserResponseDto extends ResponseDto<User> {
  firstName: string;
  lastName: string;
  avatar: string;

  constructor(user: User) {
    super(user);

    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;
  }
}
