import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { Inject } from '@nestjs/common';
import { IUserService } from 'src/contracts/user/IUserService';
import { CreateUserInputDto } from '../types/inputs/userInputDto';
import { BuilderSelectUserPipe } from '../../utils/pipes/builderSelectUser.pipe';
import { QueryUsersArgs } from '../types/args/queryUsersArgs';
import { UserPage } from '../types/dtos/userPageResult';
import {UserActionsEnum} from '../types/enums/actionEnums';

@Resolver((of) => User)
export class UserResolver {
  constructor(@Inject(IUserService) private readonly userService: IUserService) {}

  @Query((returns) => User, { name: UserActionsEnum.User, nullable: true })
  getUserById(
    @Args('id', { type: () => String }) id: string, 
    @Info(BuilderSelectUserPipe) selectUserOptions
  ) {
    return this.userService.getUserById(id, selectUserOptions);
  }

  @Query(() => UserPage, { name: UserActionsEnum.Users })
  getUsers(
    @Info(BuilderSelectUserPipe) selectUserOptions,
    @Args() queryUsersArgs: QueryUsersArgs
  ) {
    console.log('queryUsersArgs: ', queryUsersArgs)
    return this.userService.getUsers(selectUserOptions, queryUsersArgs);
  }

  @Mutation((returns) => User, { name: UserActionsEnum.CreateUser })
  createUser(@Args('createUserData') createUserData: CreateUserInputDto) {
    console.log(createUserData);
    return this.userService.createUser(createUserData);
  }
}
