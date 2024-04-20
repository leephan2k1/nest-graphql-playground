import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from 'src/graphql/interfaces/IErrorResponse';

@ObjectType({
  implements: [ErrorResponse],
})
export class InvalidCredentialsError extends ErrorResponse {
  @Field({ nullable: true })
  userId?: string;

  @Field()
  providedEmail: string;

  constructor(partial?: Partial<InvalidCredentialsError>) {
    super('Invalid credentials provided.');
    Object.assign(this, partial);
  }
}
