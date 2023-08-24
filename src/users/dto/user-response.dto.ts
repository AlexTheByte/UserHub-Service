import { User } from '../entities/user.entity';

export class UserResponseDto {
  firstName: string;
  lastName: string;
  constructor(user: User) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
