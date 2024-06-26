import { UserSetting } from 'src/graphql/models/userSetting.model';
import { CreateUserSettingsInput } from 'src/graphql/types/inputs/createUserSettingsInputDto';

export interface IUserSettingsService {
  createUserSettings(createUserSettingsData: CreateUserSettingsInput): Promise<UserSetting>;
}

export const IUserSettingsService = Symbol('IUserSettingsService');
