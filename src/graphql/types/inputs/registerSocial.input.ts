import { Field, InputType } from '@nestjs/graphql';
import { LoginSocialInput } from './loginSocial.input';

@InputType()
export class RegisterSocialInput extends LoginSocialInput {
  @Field()
  username: string;
}
