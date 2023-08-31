import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import EncryptionTransformer from 'src/transformers/encryption.transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    transformer: EncryptionTransformer,
  })
  firstName: string;

  @Column({
    transformer: EncryptionTransformer,
  })
  lastName: string;
}
