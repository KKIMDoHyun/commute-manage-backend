import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from 'src/auth/auth.repository';
import { User } from 'src/auth/entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import config = require('config');
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    // 유저를 인증하기 위해 사용할 기본 strategy를 명시(jwt)
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || jwtConfig.accessToken_secret,
      signOptions: {
        expiresIn: jwtConfig.accessToken_expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, LocalStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
