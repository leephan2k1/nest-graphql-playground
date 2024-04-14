import { PageInfo } from '../../graphql/models/pageInfo.model';

export interface IPaginateResult<T> {
  pageInfo: PageInfo;

  docs: T[];
}
