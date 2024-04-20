import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { Inject, UseGuards } from '@nestjs/common';
import { IUserService } from 'src/contracts/user/IUserService';
import { BuilderSelectUserPipe } from '../../common/pipes/builderSelectUser.pipe';
import { QueryUsersArgs } from '../types/args/queryUsersArgs';
import { UserPage } from '../types/dtos/userPageResult';
import { UserActionsEnum } from '../types/enums/actionEnums';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { GqlUser } from 'src/common/decorators/gql-user.decorator';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    @Inject(IUserService) private readonly userService: IUserService,
  ) {}

  @Query(() => User, { name: UserActionsEnum.User })
  @UseGuards(JwtAuthGuard)
  getUserStatus(@GqlUser() currentUser: User): Promise<User> {
    return Promise.resolve(currentUser);
  }

  @Query(() => UserPage, { name: UserActionsEnum.Users })
  getUsers(
    @Info(BuilderSelectUserPipe) selectUserOptions,
    @Args() queryUsersArgs: QueryUsersArgs,
  ) {
    return this.userService.getUsers(selectUserOptions, queryUsersArgs);
  }
}
