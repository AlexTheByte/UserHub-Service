import { ResponseDto } from 'src/dto/response.dto';
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
