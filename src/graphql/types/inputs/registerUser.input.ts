import { Field, InputType, PickType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
import { User } from 'src/graphql/models/user.model';

@InputType()
export class RegisterUserInput extends PickType(User, ['email'], InputType) {
  @Field()
  @MinLength(6)
  password: string;
}
