import DTO from 'src/dto/response.dto';
import { User } from '../entities/user.entity';

export class UserResponseDto extends DTO<User> {
  firstName: string;
  lastName: string;

  constructor(user: User) {
    super(user);

    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  static create<T>(data: T | T[]) {
    return super.create(data);
  }
}
