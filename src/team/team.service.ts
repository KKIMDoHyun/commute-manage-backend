import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { TeamRepository } from 'src/team/team.repository';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async getTeamMembers(user: User) {
    try {
      await this.teamRepository.isTeamMaster(user);
      return await this.teamRepository.getTeamMembers(user);
    } catch (err) {
      if (err.status === 400) {
        throw new BadRequestException(err.response, {
          cause: new Error(),
          description: err.response,
        });
      }
    }
  }

  async createTeam() {
    return await this.teamRepository.createTeam();
  }
}
