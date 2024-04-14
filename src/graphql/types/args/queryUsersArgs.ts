import { PaginationArgs } from './paginationArgsDto';
import { ArgsType, Field } from '@nestjs/graphql';
import { FindOptionsOrderValueEnum } from '../enums/findOptionsOrderValueEnum';

@ArgsType()
export class QueryUsersArgs extends PaginationArgs {
  @Field((type) => FindOptionsOrderValueEnum, { nullable: true })
  displayNameOrder?: FindOptionsOrderValueEnum;

  @Field((type) => FindOptionsOrderValueEnum, { nullable: true })
  createdAtOrder?: FindOptionsOrderValueEnum;

  @Field({ nullable: true })
  displayNameSearchTerm?: string;

  @Field({ nullable: true })
  userNameSearchTerm?: string;
}
