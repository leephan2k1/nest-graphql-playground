import { ArgsType, Field, Int } from "@nestjs/graphql";
import { Max, Min } from "class-validator";

// https://docs.nestjs.com/graphql/resolvers#class-inheritance
@ArgsType()
export class PaginationArgs {
  @Field((type) => Int)
  @Min(1)
  page: number = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  limit: number = 10;
}