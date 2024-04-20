import { createUnionType } from '@nestjs/graphql';
import { InvalidCredentialsError } from '../dtos/invalidCredentials.error';
import { MutateAuthResponse } from '../dtos/mutateAuth.response';

export const MutateAuthResultUnion = createUnionType({
  name: 'SignOutUserResult',
  types: () => [MutateAuthResponse, InvalidCredentialsError],
});
