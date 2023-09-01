import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { EncryptionTransformerConfig } from 'src/config/encryption.configuration';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    transformer: new EncryptionTransformer(EncryptionTransformerConfig),
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    transformer: new EncryptionTransformer(EncryptionTransformerConfig),
  })
  lastName: string;
}
