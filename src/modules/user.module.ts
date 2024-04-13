import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/user.model';
import { UserSetting } from 'src/graphql/models/userSetting.model';
import { UserResolver } from '../graphql/resolvers/user.resolver';
import { IUserService } from 'src/contracts/user/IUserService';
import { UserService } from 'src/services/user.service';
import { IUserRepository } from 'src/contracts/repositories/IUserRepository';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting])],
  providers: [
    UserResolver,
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
