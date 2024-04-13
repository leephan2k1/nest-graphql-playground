import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from 'src/graphql/models/userSetting.model';
import { IUserSettingsRepository } from 'src/contracts/repositories/IUserSettingsRepository';

@Injectable()
export class UserSettingsRepository extends BaseRepository<UserSetting> implements IUserSettingsRepository {
  constructor(
    @InjectRepository(UserSetting) private readonly userSettingsRepository: Repository<UserSetting>,
  ) {
    super(userSettingsRepository);
  }
}
