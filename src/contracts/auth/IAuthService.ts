import { Profile } from 'passport';
import { ErrorResponse } from 'src/graphql/interfaces/IErrorResponse';
import { SocialProviderTypes } from 'src/graphql/models/socialProvider.model';
import { User } from 'src/graphql/models/user.model';
import { AuthUserResponse } from 'src/graphql/types/dtos/authUser.response';
import { CredentialsTakenError } from 'src/graphql/types/dtos/credentialsTaken.error';
import { InvalidCredentialsError } from 'src/graphql/types/dtos/invalidCredentials.error';
import { SocialNotRegisteredError } from 'src/graphql/types/dtos/socialNotRegistered.error';
import { RegisterUserInput } from 'src/graphql/types/inputs/registerUser.input';
import { SignOutUserInput } from 'src/graphql/types/inputs/signOutUser.input';
import { Either } from 'src/utils/tools/either';
import { DeleteResult } from 'typeorm';

export interface IAuthService {
  registerUser(
    user: RegisterUserInput,
  ): Promise<Either<CredentialsTakenError, User>>;

  signTokens(user: User): Promise<AuthUserResponse>;

  changeUserPassword(user: User, newPassword: string): Promise<User>;

  validateCredentials(
    email: string,
    password: string,
  ): Promise<Either<InvalidCredentialsError, User>>;

  loginSocial(
    profile: Profile,
    provider: SocialProviderTypes,
  ): Promise<Either<SocialNotRegisteredError, User>>;

  registerUserExternal(
    profile: Profile,
    username: string,
    provider: SocialProviderTypes,
  ): Promise<Either<ErrorResponse, User>>;

  signOutUser(signOutUserInput: SignOutUserInput): Promise<DeleteResult>;
}

export const IAuthService = Symbol('IAuthService');
