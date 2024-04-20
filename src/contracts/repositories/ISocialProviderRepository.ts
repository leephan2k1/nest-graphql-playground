import { IBaseRepository } from './IBaseRepository';
import { SocialProvider } from 'src/graphql/models/socialProvider.model';

export interface ISocialProviderRepository
  extends IBaseRepository<SocialProvider> {}

export const ISocialProviderRepository = Symbol('ISocialProviderRepository');
