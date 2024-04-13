import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { Inject } from '@nestjs/common';
import { IUserService } from 'src/contracts/user/IUserService';
import { CreateUserInputDto } from '../types/userInputDto';
import { BuilderSelectUserPipe } from '../../utils/pipes/builderSelectUser.pipe';

@Resolver((of) => User)
export class UserResolver {
  constructor(@Inject(IUserService) private readonly userService: IUserService) {}

  @Query((returns) => User, { name: 'User', nullable: true })
  getUserById(
    @Args('id', { type: () => String }) id: string, 
    @Info(BuilderSelectUserPipe) selectUserOptions
  ) {
    return this.userService.getUserById(id, selectUserOptions);
  }

  @Query(() => [User], { name: 'Users' })
  getUsers(@Info(BuilderSelectUserPipe) selectUserOptions) {
    return this.userService.getUsers(selectUserOptions);
  }

  @Mutation((returns) => User, { name: 'CreateUser' })
  createUser(@Args('createUserData') createUserData: CreateUserInputDto) {
    console.log(createUserData);
    return this.userService.createUser(createUserData);
  }
}
