import { SocialProviderTypes } from 'src/graphql/models/socialProvider.model';
import { registerEnumType } from '@nestjs/graphql';

export const AuthTypes = {
  ...SocialProviderTypes,
  JWT: 'jwt',
  RefreshJwt: 'refresh-jwt',
};

registerEnumType(AuthTypes, {
  name: 'AuthTypes',
});
