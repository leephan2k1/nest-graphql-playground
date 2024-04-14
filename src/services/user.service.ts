import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../contracts/user/IUserService';
import { IUserRepository } from 'src/contracts/repositories/IUserRepository';
import { CreateUserInputDto } from 'src/graphql/types/inputs/userInputDto';
import { FindOptionsSelect } from 'typeorm';
import { User } from 'src/graphql/models/user.model';
import { QueryUsersArgs } from '../graphql/types/args/queryUsersArgs';
import { UserPage } from '../graphql/types/dtos/userPageResult';
import { IPaginateResult } from 'src/contracts/pagination/IPaginateResult';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(IUserRepository) private readonly usersRepository: IUserRepository) {}

  public async getUsers(select?: FindOptionsSelect<User>, queryUsersArgs?: QueryUsersArgs): Promise<UserPage> {
    const [ result, count ] = await this.usersRepository.findAndCount({
      select: {
        ...select,
        /* We'll encounter errors in relational databases when a field present 
          in the order is missing in the select statement, resulting in the error 
          'Column distinctAlias.Blabla does not exist.' 
          This will conflict with GraphQL query statements, 
          so we'll need to bind the select to TRUE in this situation.
        */
        displayName: select?.displayName || !!queryUsersArgs?.displayNameOrder,
        createdAt: select?.createdAt || !!queryUsersArgs?.createdAtOrder,
      },
      relations: {
        settings: !!select?.settings,
      },
      take: queryUsersArgs?.limit,
      skip: (queryUsersArgs?.page - 1) * queryUsersArgs?.limit,
      order: {
        displayName: queryUsersArgs?.displayNameOrder,
        createdAt: queryUsersArgs?.createdAtOrder,
      },
    });

    const lastPage = Math.ceil(count / queryUsersArgs?.limit);
    const userPage: IPaginateResult<User> = {
      pageInfo: {
        total: count,
        perPage: queryUsersArgs?.limit,
        currentPage: queryUsersArgs?.page,
        lastPage,
        hasNextPage: queryUsersArgs?.page < lastPage,
      },
      docs: result,
    };

    return userPage;
  }

  public async createUser(createUserData: CreateUserInputDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserData);
    return this.usersRepository.save(newUser);
  }

  public async getUserById(id: string, select?: FindOptionsSelect<User>): Promise<User> {
    const result = await this.usersRepository.findByCondition({
      select,
      where: { id },
      relations: {
        settings: !!select?.settings,
      },
    });

    return result;
  }
}
