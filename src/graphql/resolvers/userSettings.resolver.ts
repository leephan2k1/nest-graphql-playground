import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { UserSetting } from '../models/userSetting.model';
import { CreateUserSettingsInput } from '../types/inputs/createUserSettingsInputDto';
import { IUserSettingsService } from 'src/contracts/user/IUserSettingsService';

@Resolver()
export class UserSettingsResolver {
  constructor(@Inject(IUserSettingsService) private readonly userSettingsService: IUserSettingsService) {}

  @Mutation((returns) => UserSetting, { name: 'CreateUserSettings' })
  async createUserSettings(@Args('createUserSettingsData') createUserSettingsData: CreateUserSettingsInput) {
    const userSetting = await this.userSettingsService.createUserSettings(createUserSettingsData);
    return userSetting;
  }
}
