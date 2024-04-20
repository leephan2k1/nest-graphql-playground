import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/user.model';
import { UserSetting } from 'src/graphql/models/userSetting.model';
import { UserResolver } from '../graphql/resolvers/user.resolver';
import { IUserService } from 'src/contracts/user/IUserService';
import { UserService } from 'src/services/user.service';
import { IUserRepository } from 'src/contracts/repositories/IUserRepository';
import { UserRepository } from '../repositories/user.repository';
import { IUserSettingsService } from '../contracts/user/IUserSettingsService';
import { UserSettingsService } from 'src/services/userSettings.service';
import { UserSettingsResolver } from '../graphql/resolvers/userSettings.resolver';
import { IUserSettingsRepository } from 'src/contracts/repositories/IUserSettingsRepository';
import { UserSettingsRepository } from 'src/repositories/userSettings.repository';
import { SocialProvider } from '../graphql/models/socialProvider.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSetting, SocialProvider])],
  providers: [
    UserResolver,
    UserSettingsResolver,
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserSettingsService,
      useClass: UserSettingsService,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IUserSettingsRepository,
      useClass: UserSettingsRepository,
    },
  ],
  exports: [
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
