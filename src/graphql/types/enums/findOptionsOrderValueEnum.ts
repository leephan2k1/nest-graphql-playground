import { registerEnumType } from "@nestjs/graphql";

export enum FindOptionsOrderValueEnum {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
  'asc' = 'asc',
  'desc' = 'desc',
}

registerEnumType(FindOptionsOrderValueEnum, {
  name: 'FindOptionsOrderValueEnum',
});