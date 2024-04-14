import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './pageInfo.model';
import { Type } from '@nestjs/common';
import { IPaginateResult } from '../../contracts/pagination/IPaginateResult';

export function PaginateResult<T>(ItemType: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PageClass implements IPaginateResult<T> {
    @Field()
    pageInfo: PageInfo;

    @Field(() => [ItemType])
    docs: T[];
  }

  return PageClass;
}
