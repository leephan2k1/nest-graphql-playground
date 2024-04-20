import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from 'src/graphql/interfaces/IErrorResponse';
import { SocialProviderTypes } from 'src/graphql/models/socialProvider.model';

@ObjectType({
  implements: [ErrorResponse],
})
export class SocialNotRegisteredError extends ErrorResponse {
  @Field((_type) => SocialProviderTypes)
  provider: SocialProviderTypes;

  constructor(partial?: Partial<SocialNotRegisteredError>) {
    super('No account registered with this social provider.');
    Object.assign(this, partial);
  }
}
