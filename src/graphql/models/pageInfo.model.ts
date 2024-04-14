import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPageInfo } from '../../contracts/pagination/IPageInfo';

@ObjectType()
export class PageInfo implements IPageInfo {
  @Field((type) => Int)
  total: number;

  @Field((type) => Int)
  perPage: number;

  @Field((type) => Int)
  currentPage: number;

  @Field((type) => Int)
  lastPage: number;

  @Field()
  hasNextPage: boolean;
}
