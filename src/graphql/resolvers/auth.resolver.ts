import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthActionsEnum } from '../types/enums/actionEnums';
import { LoginUserInput } from '../types/inputs/loginUser.input';
import { LoginUserResultUnion } from '../types/unions/loginUser.result';
import { RegisterUserResultUnion } from '../types/dtos/registerUser.result';
import { RegisterUserInput } from '../types/inputs/registerUser.input';
import { IAuthService } from 'src/contracts/auth/IAuthService';
import { InvalidCredentialsError } from '../types/dtos/invalidCredentials.error';
import { RefreshJwtAuthGuard } from '../../guards/jwtAuth.guard';
import { User } from '../models/user.model';
import { GqlUser } from 'src/common/decorators/gql-user.decorator';
import { MutateAuthResultUnion } from '../types/unions/mutateAuthResult.result';
import { SignOutUserInput } from '../types/inputs/signOutUser.input';
import { SocialAuthGuard } from 'src/guards/socialAuth.guard';
import { LoginSocialResultUnion } from '../types/unions/loginSocial.result';
import { Profile } from 'passport';
import { SocialProfile } from 'src/common/decorators/social-profile.decorator';
import { LoginSocialInput } from '../types/inputs/loginSocial.input';
import { RegisterSocialResultUnion } from '../types/enums/registerSocial.result';
import { RegisterSocialInput } from '../types/inputs/registerSocial.input';
import { MutateAuthResponse } from '../types/dtos/mutateAuth.response';
import { ResponseStatus } from '../types/enums/voidResponseEnums';
import { ChangePasswordInput } from '../types/inputs/changePassword.input';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(IAuthService) private readonly authService: IAuthService,
  ) {}

  @Mutation(() => [LoginUserResultUnion], {
    name: AuthActionsEnum.SignInInternal,
  })
  public async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<Array<typeof LoginUserResultUnion>> {
    const result = await this.authService.validateCredentials(
      loginUserInput.email,
      loginUserInput.password,
    );

    if (result.isError()) {
      return [result.value as unknown as InvalidCredentialsError];
    }

    const authUser = await this.authService.signTokens(result.value);
    return [authUser];
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [MutateAuthResultUnion], {
    name: AuthActionsEnum.ChangePassword,
  })
  public async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @GqlUser() currentUser: User
  ) {
    const {currentPassword, newPassword } = changePasswordInput 
    const result = await this.authService.validateCredentials(
      currentUser.email,
      currentPassword,
    );

    if (result.isError()) {
      return [result.value as unknown as InvalidCredentialsError];
    }

    const updatedUser = await this.authService.changeUserPassword(
      result.value,
      newPassword,
    );

    if (updatedUser) {
      return [new MutateAuthResponse({ status: ResponseStatus.Success })];
    }

    return [new MutateAuthResponse({ status: ResponseStatus.Error })];
  }

  @UseGuards(SocialAuthGuard)
  @Mutation(() => [LoginSocialResultUnion], {
    name: AuthActionsEnum.SignInExternal,
  })
  public async loginExternal(
    @SocialProfile() profile: Profile,
    @Args('input') input: LoginSocialInput,
  ) {
    const social = await this.authService.loginSocial(profile, input.provider);

    if (social.isError()) {
      return [social.value];
    }

    const authUser = await this.authService.signTokens(social.value);
    return [authUser];
  }

  @UseGuards(SocialAuthGuard)
  @Mutation((_returns) => [RegisterSocialResultUnion], {
    name: AuthActionsEnum.SignUpExternal,
  })
  public async registerExternal(
    @SocialProfile() profile: Profile,
    @Args('input') input: RegisterSocialInput,
  ) {
    const social = await this.authService.registerUserExternal(
      profile,
      input.username,
      input.provider,
    );

    if (social.isError()) {
      return [social.value];
    }

    const authUser = await this.authService.signTokens(social.value);
    return [authUser];
  }

  @Mutation(() => [LoginUserResultUnion], {
    name: AuthActionsEnum.RefreshToken,
  })
  @UseGuards(RefreshJwtAuthGuard)
  public async signNewTokens(@GqlUser() currentUser: User) {
    const authUser = await this.authService.signTokens(currentUser);
    return [authUser];
  }

  @Mutation(() => [RegisterUserResultUnion], {
    name: AuthActionsEnum.SignUpInternal,
  })
  public async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ) {
    const result = await this.authService.registerUser(registerUserInput);

    if (result.isError()) {
      return [result.value];
    }

    const authUser = await this.authService.signTokens(result.value);
    return [authUser];
  }

  @Mutation(() => [MutateAuthResultUnion], { name: AuthActionsEnum.SignOut })
  public async signOut(
    @Args('signOutUserInput') signOutUserInput: SignOutUserInput,
  ) {
    const { refresh_token } = signOutUserInput;
    const result = await this.authService.signOutUser({ refresh_token });

    if (result?.affected > 0) {
      return [new MutateAuthResponse({ status: ResponseStatus.Success })];
    }

    return [new MutateAuthResponse({ status: ResponseStatus.Error })];
  }
}
