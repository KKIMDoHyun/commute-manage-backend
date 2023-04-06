import { Module } from '@nestjs/common';
import { CommuteRecordsModule } from './commute_records/commute_records.module';
import config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ScheduleModule } from '@nestjs/schedule';

const dbConfig = config.get('db');
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: dbConfig.synchronize,
    }),
    CommuteRecordsModule,
    AuthModule,
    TeamModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
