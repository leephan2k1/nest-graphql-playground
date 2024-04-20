import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/graphql/models/token.model';
import { ITokenRepository } from '../contracts/repositories/ITokenRepository';

@Injectable()
export class TokenRepository extends BaseRepository<Token> implements ITokenRepository {
  constructor(
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository);
  }
}
