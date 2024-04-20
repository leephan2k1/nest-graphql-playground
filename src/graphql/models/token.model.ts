import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.model';
import { User } from './user.model';

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Index({ unique: true })
  @Column()
  token: string;
}
