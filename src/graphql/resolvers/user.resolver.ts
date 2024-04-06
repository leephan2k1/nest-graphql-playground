import {
  Args,
  Info,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../models/user.model';
import { mockUsers } from 'src/__mocks__/mockUsers';
import { UserSetting } from '../models/userSetting.model';
import { mockUserSettings } from 'src/__mocks__/mockUserSettings';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => User, { name: 'User', nullable: true })
  getUserById(@Args('id', { type: () => Int }) id: number, @Info() info) {
    const userRequest = parseResolveInfo(info).fieldsByTypeName?.User;

    /* "The issue arises when we don't use @ResolveField is that we retrieve too many fields that may be surplus to the request. 
    If using a relational database, unnecessary joins or unions may occur. 
    To fetch based on query demand, we need to check which fields have been requested."
    */
    const { userName, displayName, settings } = userRequest as unknown as User;
    return mockUsers.find((e) => e.id === id);
  }

  @Query(() => [User], { name: 'Users' })
  getUsers() {
    console.log('test: ', mockUsers);
    return mockUsers;
  }

  /*
    The following code snippet is not recommended; 
    even the NestJS documentation advises against using ResolveField. 
    It will lead to the n+1 problem for the database.
  */
  // @ResolveField((returns) => UserSetting, { name: 'settings', nullable: true })
  // getUserSettings(@Parent() user: User) {
  //   const { id } = user;
  //   return mockUserSettings.find((e) => e.userId === id);
  // }
}
