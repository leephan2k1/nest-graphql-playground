import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from 'src/contracts/auth/IAuthService';
import { ITokenRepository } from 'src/contracts/repositories/ITokenRepository';
import { IUserService } from 'src/contracts/user/IUserService';
import { User } from 'src/graphql/models/user.model';
import { AuthUserResponse } from 'src/graphql/types/dtos/authUser.response';
import { CredentialsTakenError } from 'src/graphql/types/dtos/credentialsTaken.error';
import { RegisterUserInput } from 'src/graphql/types/inputs/registerUser.input';
import { either, Either } from 'src/utils/tools/either';
import { ConfigType } from '@nestjs/config';
import { JwtConfig } from 'src/configs';
import { InvalidCredentialsError } from 'src/graphql/types/dtos/invalidCredentials.error';
import { Profile } from 'passport';
import { SocialProviderTypes } from 'src/graphql/models/socialProvider.model';
import { SocialNotRegisteredError } from 'src/graphql/types/dtos/socialNotRegistered.error';
import { ISocialProviderRepository } from 'src/contracts/repositories/ISocialProviderRepository';
import { SocialAlreadyAssignedError } from 'src/graphql/types/dtos/socialAlreadyAssigned.error';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ErrorResponse } from 'src/graphql/interfaces/IErrorResponse';
import { SignOutUserInput } from 'src/graphql/types/inputs/signOutUser.input';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(IUserService) private readonly userService: IUserService,
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
    @Inject(JwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof JwtConfig>,
    @Inject(ISocialProviderRepository)
    private readonly socialProviderRepository: ISocialProviderRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async registerUser(
    user: RegisterUserInput,
  ): Promise<Either<CredentialsTakenError, User>> {
    if (await this.userService.existsByCredentials(user)) {
      return either.error(
        new CredentialsTakenError({
          providedEmail: user.email,
        }),
      );
    }

    const newUser = await this.userService.createUser(user);
    return either.of(newUser);
  }

  public async changeUserPassword(user: User, newPassword: string): Promise<User> {
    return this.userService.updateUserPassword(user.id, newPassword);
  }

  public async registerUserExternal(
    profile: Profile,
    username: string,
    provider: SocialProviderTypes,
  ): Promise<Either<ErrorResponse, User>> {
    const email = profile.emails![0].value;
    const socialId = profile.id;

    // check existing social account
    if (
      await this.socialProviderRepository.findByCondition({
        where: { socialId },
      })
    ) {
      return either.error(
        new SocialAlreadyAssignedError({
          provider,
        }),
      );
    }

    // check existing account link to social
    if (
      await this.userService.existsByCredentials({
        email,
        userName: username,
      })
    ) {
      return either.error(
        new CredentialsTakenError({
          providedEmail: email,
          providedUsername: username,
        }),
      );
    }

    const newUser = await this.userService.saveProviderAndUser(
      {
        userName: username,
        email,
        password: randomStringGenerator(),
      },
      {
        provider,
        socialId,
      },
    );

    return either.of(newUser);
  }

  public async signTokens(user: User): Promise<AuthUserResponse> {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConf.refreshSecret,
      expiresIn: this.jwtConf.refreshExpiresIn,
    });

    await this.tokenRepository.save({ user, token: refreshToken });

    return new AuthUserResponse({
      user,
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    });
  }

  public async validateCredentials(
    email: string,
    password: string,
  ): Promise<Either<InvalidCredentialsError, User>> {
    const user = await this.userService.getUserByConditions({ email });

    if (!(await user?.comparePassword(password))) {
      return either.error(
        new InvalidCredentialsError({
          providedEmail: email,
        }),
      );
    }

    return either.of(user);
  }

  public async loginSocial(
    profile: Profile,
    provider: SocialProviderTypes,
  ): Promise<Either<SocialNotRegisteredError, User>> {
    const user = await this.userService.findOneBySocialId(profile.id);

    if (!user) {
      return either.error(
        new SocialNotRegisteredError({
          provider,
        }),
      );
    }

    return either.of(user);
  }

  public async signOutUser(signOutUserInput: SignOutUserInput) {
    const { refresh_token } = signOutUserInput;

    return await this.tokenRepository.delete({ token: refresh_token });
  }
}
