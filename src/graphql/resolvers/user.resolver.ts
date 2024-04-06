import { Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.model';

@Resolver()
export class UserResolver {
  @Query((returns) => User, { name: 'User' })
  getUser() {
    return {
      id: 1,
      userName: 'userName',
      displayName: 'displayName',
    };
  }
}
