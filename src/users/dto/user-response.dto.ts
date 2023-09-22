import { ResponseDto } from '@travel-1/travel-sdk';
import { User } from '../entities/user.entity';

export class UserResponseDto extends ResponseDto<User> {
  first_name: string;
  last_name: string;
  birth_date: Date;
  avatar: string;
  bio: string;
  languages: Array<number>;
  interests: Array<number>;

  constructor(user: User) {
    super(user);

    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.birth_date = user.birth_date;
    this.avatar = user.avatar;
    this.bio = user.bio;
    this.languages = user.languages;
    this.interests = user.interests;
  }
}
