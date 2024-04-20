import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @MinLength(6)
  newPassword: string;

  @Field()
  currentPassword: string;
}
