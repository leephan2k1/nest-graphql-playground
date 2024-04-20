import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignOutUserInput {
  @Field({ nullable: true })
  refresh_token?: string;
}
