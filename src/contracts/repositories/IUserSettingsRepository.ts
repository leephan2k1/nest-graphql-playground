import { IBaseRepository } from './IBaseRepository';
import { UserSetting } from 'src/graphql/models/userSetting.model';

export interface IUserSettingsRepository extends IBaseRepository<UserSetting> {}

export const IUserSettingsRepository = Symbol('IUserSettingsRepository');
