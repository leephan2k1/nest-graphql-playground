import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/contracts/repositories/IUserRepository';
import { User } from 'src/graphql/models/user.model';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
