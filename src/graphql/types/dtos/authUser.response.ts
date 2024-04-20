import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/graphql/models/user.model';

@ObjectType()
export class AuthUserResponse {
  @Field((_type) => User)
  user: User;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  constructor(partial?: Partial<AuthUserResponse>) {
    Object.assign(this, partial);
  }
}
