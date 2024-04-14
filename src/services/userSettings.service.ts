import { Injectable, Inject } from '@nestjs/common';
import { IUserSettingsService } from 'src/contracts/user/IUserSettingsService';
import { IUserRepository } from 'src/contracts/repositories/IUserRepository';
import { CreateUserSettingsInput } from 'src/graphql/types/inputs/createUserSettingsInputDto';
import { IUserSettingsRepository } from 'src/contracts/repositories/IUserSettingsRepository';

@Injectable()
export class UserSettingsService implements IUserSettingsService {
  constructor(
    @Inject(IUserSettingsRepository) private readonly userSettingsRepository: IUserSettingsRepository,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  public async createUserSettings(createUserSettingsData: CreateUserSettingsInput) {
    const findUser = await this.userRepository.findOneById(createUserSettingsData.userId);

    if (!findUser) throw new Error('User Not Found');

    const newUserSetting = this.userSettingsRepository.create(createUserSettingsData);
    const savedSettings = await this.userSettingsRepository.save(newUserSetting);

    findUser.settings = savedSettings;
    await this.userRepository.save(findUser);

    return savedSettings;
  }
}
