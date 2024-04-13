import { User } from 'src/graphql/models/user.model';
import { IBaseRepository } from './IBaseRepository';

export interface IUserRepository extends IBaseRepository<User> {}

export const IUserRepository = Symbol('IUserRepository');
