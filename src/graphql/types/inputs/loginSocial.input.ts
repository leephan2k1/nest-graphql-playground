import { Field, InputType } from '@nestjs/graphql';
import { SocialProviderTypes } from 'src/graphql/models/socialProvider.model';

@InputType()
export class LoginSocialInput {
  @Field()
  accessToken: string;

  @Field((_type) => SocialProviderTypes)
  provider: SocialProviderTypes;
}
