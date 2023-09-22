export interface IUpdateUser {
  first_name?: string;
  last_name?: string;
  birth_date?: Date;
  avatar?: string;
  mobile_phone?: string;
  bio?: string;
  languages?: Array<number>;
  interests?: Array<number>;
}
