import { Module } from '@nestjs/common';
import { CommuteRecordsModule } from './commute_records/commute_records.module';
import * as config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
