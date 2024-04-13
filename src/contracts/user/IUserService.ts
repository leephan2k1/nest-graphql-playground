import { User } from 'src/graphql/models/user.model';
import { CreateUserInputDto } from 'src/graphql/types/userInputDto';
import { FindOptionsSelect } from 'typeorm';

export interface IUserService {
  getUsers(select?: FindOptionsSelect<User>): Promise<User[]>;

  createUser(createUserData: CreateUserInputDto): Promise<User>;

  getUserById(id: string, select?: FindOptionsSelect<User>): Promise<User>;
}

export const IUserService = Symbol('IUserService');
