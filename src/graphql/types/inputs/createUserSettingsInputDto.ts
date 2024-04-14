import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserSettingsInput {
  @Field()
  userId: string;

  @Field({ nullable: true, defaultValue: false })
  receiveNotifications: boolean;

  @Field({ nullable: true, defaultValue: false })
  receiveEmails: boolean;
}
