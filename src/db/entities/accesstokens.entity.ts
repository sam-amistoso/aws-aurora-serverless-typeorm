import { Column, Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('access_tokens')
export class AccessTokens {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column('int')
  ttl: number;

  @Column('int')
  createdAt: number;

  @Column('varchar')
  scope: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
