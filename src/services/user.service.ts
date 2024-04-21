import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../contracts/user/IUserService';
import { IUserRepository } from 'src/contracts/repositories/IUserRepository';
import { DataSource, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { User } from 'src/graphql/models/user.model';
import { QueryUsersArgs } from '../graphql/types/args/queryUsersArgs';
import { UserPage } from '../graphql/types/dtos/userPageResult';
import { IPaginateResult } from 'src/contracts/pagination/IPaginateResult';
import { SocialProvider } from 'src/graphql/models/socialProvider.model';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository) private readonly usersRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private dataSource: DataSource,
  ) {}

  public async saveProviderAndUser(
    user: Partial<User>,
    provider: Partial<SocialProvider>,
  ) {
    return this.dataSource.manager.transaction(async (transactionalManager) => {
      const createdUser = transactionalManager.create(User, user);
      const savedUser = await transactionalManager.save(createdUser);

      await transactionalManager.save(SocialProvider, {
        user: savedUser,
        ...provider,
      });

      return savedUser;
    });
  }

  public async getUsers(
    select?: FindOptionsSelect<User>,
    queryUsersArgs?: QueryUsersArgs,
  ): Promise<UserPage> {
    console.time('get users');
    const [result, count] = await this.usersRepository.findAndCount({
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
    console.timeEnd('get users');
    return userPage;
  }

  public async getUserById(
    id: string,
    select?: FindOptionsSelect<User>,
  ): Promise<User> {
    const result = await this.usersRepository.findByCondition({
      select,
      where: { id },
      relations: {
        settings: !!select?.settings,
      },
    });

    return result;
  }

  public async getUserByConditions(user: Partial<User>): Promise<User> {
    const { password, ...userWithoutPassword } = user;
    const result = await this.usersRepository.findByCondition({
      where: userWithoutPassword as FindOptionsWhere<User>,
    });

    return result;
  }

  public async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      return null;
    }

    user.password = newPassword;
    return await this.usersRepository.save(user);
  }

  public async existsByCredentials(
    user: Pick<User, 'email' | 'userName'>,
  ): Promise<boolean> {
    const result = await this.usersRepository.findByCondition({
      where: [{ email: user.email }, { userName: user.userName }],
    });
    return !!result;
  }

  public async createUser(
    user: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    const { password, ...newUserWithoutPassword } = newUser;

    return newUserWithoutPassword as Omit<User, 'password'>;
  }

  public async findOneBySocialId(socialId: string): Promise<User | undefined> {
    const user = await this.usersRepository.findByCondition({
      where: {
        socialProviders: {
          socialId,
        },
      },
    });

    return user;
  }
}
