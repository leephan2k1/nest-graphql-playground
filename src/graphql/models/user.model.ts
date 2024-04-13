import { Field, ObjectType } from '@nestjs/graphql';
import { UserSetting } from './userSetting.model';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.model';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseEntity {
  @Column()
  @Field()
  userName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  displayName?: string;

  @OneToOne(() => UserSetting)
  @JoinColumn()
  @Field({ nullable: true })
  settings?: UserSetting;
}
