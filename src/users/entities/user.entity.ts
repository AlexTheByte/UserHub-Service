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
  first_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    transformer: new EncryptionTransformer(EncryptionTransformerConfig),
  })
  last_name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    transformer: new EncryptionTransformer(EncryptionTransformerConfig),
  })
  mobile_phone: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatar: string;
}
