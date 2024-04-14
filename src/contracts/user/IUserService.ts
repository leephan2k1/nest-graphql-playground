import { User } from 'src/graphql/models/user.model';
import { QueryUsersArgs } from 'src/graphql/types/args/queryUsersArgs';
import { UserPage } from 'src/graphql/types/dtos/userPageResult';
import { CreateUserInputDto } from 'src/graphql/types/inputs/userInputDto';
import { FindOptionsSelect } from 'typeorm';

export interface IUserService {
  getUsers(select?: FindOptionsSelect<User>, queryUsersArgs?: QueryUsersArgs): Promise<UserPage>;

  createUser(createUserData: CreateUserInputDto): Promise<User>;

  getUserById(id: string, select?: FindOptionsSelect<User>): Promise<User>;
}

export const IUserService = Symbol('IUserService');
