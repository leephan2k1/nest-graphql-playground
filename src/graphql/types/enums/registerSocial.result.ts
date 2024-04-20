import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../dtos/authUser.response';
import { SocialAlreadyAssignedError } from '../dtos/socialAlreadyAssigned.error';
import { CredentialsTakenError } from '../dtos/credentialsTaken.error';

export const RegisterSocialResultUnion = createUnionType({
  name: 'RegisterSocialResult',
  types: () => [
    AuthUserResponse,
    SocialAlreadyAssignedError,
    CredentialsTakenError,
  ],
});
