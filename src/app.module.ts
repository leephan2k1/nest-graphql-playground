import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserResolver } from './graphql/resolvers/user.resolver';
import { UserSettings } from './graphql/resolvers/userSettings.resolver';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dbOptions = {
          type: 'postgres',
          host: config.get<string>('PG_HOST'),
          port: config.get<string>('PG_PORT'),
          username: config.get<string>('PG_USERNAME'),
          password: config.get<string>('PG_PASSWORD'),
          database: config.get<string>('PG_DB'),
          synchronize: true,
        } as unknown as TypeOrmModuleOptions;
        return dbOptions;
      },
    }),
  ],
  providers: [UserResolver, UserSettings],
})
export class AppModule {}
