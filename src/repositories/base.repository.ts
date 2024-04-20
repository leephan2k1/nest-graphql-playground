import {
  FindOneOptions,
  FindManyOptions,
  Repository,
  DeepPartial,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
  ObjectLiteral,
} from 'typeorm';
import { IBaseRepository } from '../contracts/repositories/IBaseRepository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
interface HasId {
  id: string;
}

export abstract class BaseRepository<T extends HasId> implements IBaseRepository<T> {
  private readonly entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async update(options: FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<ObjectLiteral extends T ? unknown : T>): Promise<UpdateResult> {
    //@ts-ignore
    return this.entity.update(options, partialEntity)
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAndCount(
    options?: FindManyOptions<T>,
  ): Promise<[T[], number]> {
    return await this.entity.findAndCount(options);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async delete(options: FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.entity.delete(options);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}
