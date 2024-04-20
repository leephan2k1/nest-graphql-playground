import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../dtos/authUser.response';
import { InvalidCredentialsError } from '../dtos/invalidCredentials.error';

export const LoginUserResultUnion = createUnionType({
  name: 'LoginUserResult',
  types: () => [AuthUserResponse, InvalidCredentialsError],
});
