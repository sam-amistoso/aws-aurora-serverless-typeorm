import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AccessTokens } from './accesstokens.entity';

export enum AccountTypes {
  ADMINISTRATOR = 'administrator',
  COORDINATOR = 'coordinator',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  password: string;

  @Column('varchar')
  agency: string;

  @Column({
    type: 'enum',
    enum: AccountTypes,
  })
  account: string;

  @Column({ nullable: true, type: 'varchar' })
  workNumber: string;

  @Column({ nullable: true, type: 'varchar' })
  mobileNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AccessTokens, (token) => token.user)
  token: AccessTokens[];
}
