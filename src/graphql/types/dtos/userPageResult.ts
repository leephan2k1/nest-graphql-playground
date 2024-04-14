import { ObjectType } from '@nestjs/graphql';
import { PaginateResult } from '../../models/paginateResult.model';
import { User } from 'src/graphql/models/user.model';

@ObjectType()
export class UserPage extends PaginateResult(User) {}
