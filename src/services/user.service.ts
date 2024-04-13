import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../contracts/user/IUserService';
import { IUserRepository } from 'src/contracts/repositories/IUserRepository';
import { CreateUserInputDto } from 'src/graphql/types/userInputDto';
import { FindOptionsSelect } from 'typeorm';
import { User } from 'src/graphql/models/user.model';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(IUserRepository) private readonly usersRepository: IUserRepository) {}

  public async getUsers(select?: FindOptionsSelect<User>): Promise<User[]> {
    const result = await this.usersRepository.findAll({
      select,
    });
    return result;
  }

  public async createUser(createUserData: CreateUserInputDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserData);
    return this.usersRepository.save(newUser);
  }

  public async getUserById(id: string, select?: FindOptionsSelect<User>): Promise<User> {
    const result = await this.usersRepository.findByCondition({
      select,
      where: { id },
    });

    return result;
  }
}
