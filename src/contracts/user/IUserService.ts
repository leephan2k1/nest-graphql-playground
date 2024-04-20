import { SocialProvider } from 'src/graphql/models/socialProvider.model';
import { User } from 'src/graphql/models/user.model';
import { QueryUsersArgs } from 'src/graphql/types/args/queryUsersArgs';
import { UserPage } from 'src/graphql/types/dtos/userPageResult';
import { FindOptionsSelect, UpdateResult } from 'typeorm';

export interface IUserService {
  getUsers(
    select?: FindOptionsSelect<User>,
    queryUsersArgs?: QueryUsersArgs,
  ): Promise<UserPage>;

  saveProviderAndUser(
    user: Partial<User>,
    provider: Partial<SocialProvider>,
  ): Promise<User>;

  updateUserPassword(userId: string, password: string): Promise<User>

  createUser(user: Partial<User>): Promise<Omit<User, 'password'>>;

  getUserById(id: string, select?: FindOptionsSelect<User>): Promise<User>;

  existsByCredentials(user: Pick<User, 'email' | 'userName'>): Promise<boolean>;

  getUserByConditions(user: Partial<User>): Promise<User>;

  findOneBySocialId(socialId: string): Promise<User | undefined>;
}

export const IUserService = Symbol('IUserService');
