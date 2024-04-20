import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../dtos/authUser.response';
import { SocialNotRegisteredError } from '../dtos/socialNotRegistered.error';

export const LoginSocialResultUnion = createUnionType({
  name: 'LoginSocialResult',
  types: () => [AuthUserResponse, SocialNotRegisteredError],
});
