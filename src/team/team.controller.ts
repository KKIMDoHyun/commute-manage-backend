import { Controller, Get, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/ExceptionFilter/httpExceptionFilter';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';
import { TeamService } from 'src/team/team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get('/members')
  @UseFilters(new HttpExceptionFilter())
  getTeamMembers(@GetUser() user: User) {
    return this.teamService.getTeamMembers(user);
  }

  @Post('/')
  createTeam() {
    return this.teamService.createTeam();
  }
}
