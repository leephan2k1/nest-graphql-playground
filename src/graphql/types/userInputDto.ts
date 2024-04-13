import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInputDto {
  @Field()
  userName: string;

  @Field({ nullable: true })
  displayName?: string;
}
