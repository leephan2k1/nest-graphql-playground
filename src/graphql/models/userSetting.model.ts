import { Field, ObjectType } from '@nestjs/graphql';
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './base.model';

@Entity({ name: 'user_settings' })
@ObjectType()
export class UserSetting extends BaseEntity {
  @PrimaryColumn()
  @Field()
  userId: string;

  @Column({ default: false })
  @Field({ defaultValue: false })
  receiveNotifications: boolean;

  @Column({ default: false })
  @Field({ defaultValue: false })
  receiveEmails: boolean;
}
