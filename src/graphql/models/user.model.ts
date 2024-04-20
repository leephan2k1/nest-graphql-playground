import { Field, ObjectType } from '@nestjs/graphql';
import { UserSetting } from './userSetting.model';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.model';
import { IsEmail, MinLength } from 'class-validator';
import { encodePassword, decodePassword } from '../../utils/security/bcrypt';
import { SocialProvider } from './socialProvider.model';
import { Token } from './token.model';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ nullable: true })
  @Field({ nullable: true })
  userName?: string;

  @IsEmail()
  @Index({ unique: true })
  @Column()
  @Field()
  email: string;

  @Column({ nullable: true })
  @MinLength(6)
  password?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  displayName?: string;

  @OneToOne(() => UserSetting)
  @JoinColumn()
  @Field({ nullable: true })
  settings?: UserSetting;

  @OneToMany(() => Token, (token) => token.user)
  @JoinColumn()
  refreshTokens: Token[];

  @OneToMany((_type) => SocialProvider, (socialProvider) => socialProvider.user)
  socialProviders: SocialProvider;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await encodePassword(this.password);
  }

  async comparePassword(password: string) {
    return decodePassword({
      currentPassword: this.password,
      reqPassword: password,
    });
  }
}
