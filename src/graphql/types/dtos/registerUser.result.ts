import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from './authUser.response';
import { InvalidInputError } from './invalidInput.error';
import { CredentialsTakenError } from './credentialsTaken.error';

export const RegisterUserResultUnion = createUnionType({
  name: 'RegisterUserResult',
  types: () => [AuthUserResponse, InvalidInputError, CredentialsTakenError],
});
