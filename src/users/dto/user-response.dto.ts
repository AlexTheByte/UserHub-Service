import ResponseDto from 'src/dto/response.dto';
import { User } from '../entities/user.entity';

export default class UserResponseDto extends ResponseDto<User> {
  firstName: string;
  lastName: string;

  constructor(user: User) {
    super(user);

    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
