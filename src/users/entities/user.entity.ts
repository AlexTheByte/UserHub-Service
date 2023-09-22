import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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
    nullable: false,
    transformer: new EncryptionTransformer(EncryptionTransformerConfig),
  })
  birth_date: Date;

  @Column({
    type: 'varchar',
    nullable: true,
    transformer: new EncryptionTransformer(EncryptionTransformerConfig),
  })
  avatar: string;

  @Column({
    type: 'longtext',
    nullable: true,
    transformer: new EncryptionTransformer(EncryptionTransformerConfig),
  })
  bio: string;

  @Column('simple-array', { nullable: true })
  languages: Array<any>;

  @Column('simple-array', { nullable: true })
  interests: Array<any>;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
