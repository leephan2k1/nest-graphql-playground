import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>): T;

  createMany(data: DeepPartial<T>[]): T[];

  save(data: DeepPartial<T>): Promise<T>;

  saveMany(data: DeepPartial<T>[]): Promise<T[]>;

  findOneById(id: string | number): Promise<T>;

  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;

  findAll(options?: FindManyOptions<T>): Promise<T[]>;

  findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;

  remove(data: T): Promise<T>;

  delete(options: FindOptionsWhere<T>): Promise<DeleteResult>;

  update(
    options: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<
      ObjectLiteral extends T ? unknown : T
    >,
  ): Promise<UpdateResult>;

  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;

  preload(entityLike: DeepPartial<T>): Promise<T>;
}
