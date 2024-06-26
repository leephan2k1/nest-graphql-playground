import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { envSchema } from './configs/env.schema';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    UserModule,
    AuthModule,

    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   isGlobal: true,
    //   useFactory: async (config: ConfigService) => {
    //     console.log('redis setup: ',  {
    //       store: redisStore,
    //       host: config.get('REDIS_HOST'),
    //       port: config.get('REDIS_PORT'),
    //       password: config.get('REDIS_PASSWORD'),
    //     })

    //     return {
    //       store: redisStore,
    //       host: config.get('REDIS_HOST'),
    //       port: config.get('REDIS_PORT'),
    //       password: config.get('REDIS_PASSWORD'),
    //     }
    //   },
    // }),

    ConfigModule.forRoot({
      cache: true,
      validationSchema: envSchema,
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (config: ConfigService) => {
        return {
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions?.code,
            };
          },
        };
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dbOptions: TypeOrmModuleOptions = {
          type: 'postgres',
          host: config.get<string>('PG_HOST'),
          port: Number(config.get<string>('PG_PORT')),
          username: config.get<string>('PG_USERNAME'),
          password: config.get<string>('PG_PASSWORD'),
          database: config.get<string>('PG_DB'),
          synchronize: true,
          autoLoadEntities: true,
        };
        return dbOptions;
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<ThrottlerModuleOptions> => {
        return {
          throttlers: [
            {
              ttl: config.get<number>('SECURITY_THROTTLE_TTL'),
              limit: config.get<number>('SECURITY_THROTTLE_LIMIT'),
            },
          ],
        };
      },
    }),
  ],
  providers: [],
})
export class AppModule {}
