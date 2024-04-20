import { Token } from 'src/graphql/models/token.model';
import { IBaseRepository } from './IBaseRepository';

export interface ITokenRepository extends IBaseRepository<Token> {}

export const ITokenRepository = Symbol('ITokenRepository');
