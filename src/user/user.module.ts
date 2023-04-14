import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
