import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Team } from 'src/team/entity/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamRepository } from 'src/team/team.repository';
import { User } from 'src/auth/entity/user.entity';
import { AuthRepository } from 'src/auth/auth.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository, AuthRepository],
})
export class TeamModule {}
