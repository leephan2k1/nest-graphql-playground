import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthResolver } from '../graphql/resolvers/auth.resolver';
import { UserModule } from './user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleConfig, JwtConfig } from 'src/configs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IAuthService } from 'src/contracts/auth/IAuthService';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshJwtStrategy } from '../strategies/jwt.strategy';
import { ITokenRepository } from 'src/contracts/repositories/ITokenRepository';
import { TokenRepository } from 'src/repositories/token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/graphql/models/token.model';
import { ISocialProviderRepository } from 'src/contracts/repositories/ISocialProviderRepository';
import { SocialProviderRepository } from 'src/repositories/socialProvider.repository';
import {SocialProvider} from 'src/graphql/models/socialProvider.model';
import {GoogleStrategy} from '../strategies/google.stragegy';

@Module({
  imports: [
    ConfigModule.forFeature(GoogleConfig),
    ConfigModule.forFeature(JwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signInOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    TypeOrmModule.forFeature([Token, SocialProvider]),
  ],
  controllers: [],
  providers: [
    AuthResolver,
    GoogleStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: ITokenRepository,
      useClass: TokenRepository,
    },
    {
      provide: ISocialProviderRepository,
      useClass: SocialProviderRepository,
    },
  ],
})
export class AuthModule {}
