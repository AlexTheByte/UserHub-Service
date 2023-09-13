import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('auths')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(type => User, { cascade: true, onDelete: 'CASCADE', lazy: true })
  @JoinColumn()
  user: User;
}
