import { Module } from '@nestjs/common';
import { CommuteRecordsModule } from './commute_records/commute_records.module';
import config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/auth/strategies/jwt-refresh.strategy';
import { AuthService } from 'src/auth/auth.service';
import { AuthRepository } from 'src/auth/auth.repository';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserModule } from './user/user.module';
import { typeORMConfig } from 'src/configs/typeorm.config';

const dbConfig = config.get('db');
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    CommuteRecordsModule,
    AuthModule,
    TeamModule,
    ScheduleModule.forRoot(),
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
