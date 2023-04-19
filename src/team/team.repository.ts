import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { Team } from 'src/team/entity/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamRepository extends Repository<Team> {
  @InjectRepository(Team)
  private readonly teamRepository: Repository<Team>;

  async isTeamMaster(user: User): Promise<void> {
    if (!user.isMaster) {
      throw new HttpException(
        '해당 팀의 장이 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTeamMembers(user: User) {
    const teams = await this.teamRepository.manager
      .getTreeRepository(Team)
      .findDescendants(user.team, { relations: ['user'] });
    const filteredTeam = teams.filter((v) => v.name !== user.team.name);

    const subTeams = filteredTeam.map((team) => {
      return {
        id: team.id,
        name: team.name,
        user: team.user
          .map((user) => {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              isMaster: user.isMaster,
            };
          })
          .sort((a, b) =>
            a.isMaster === b.isMaster ? 0 : a.isMaster ? -1 : 1,
          ),
      };
    });
    return { id: teams[0].id, name: teams[0].name, subTeams };
  }

  async createTeam() {
    const t1 = new Team();
    t1.name = '티맥스 커머스';
    await this.teamRepository.manager.save(t1);

    const t2 = new Team();
    t2.name = 'PM본부';
    t2.parent = t1;
    await this.teamRepository.manager.save(t2);

    const t3 = new Team();
    t3.name = 'CM본부';
    t3.parent = t1;
    await this.teamRepository.manager.save(t3);

    const t4 = new Team();
    t4.name = 'PD팀';
    t4.parent = t2;
    await this.teamRepository.manager.save(t4);

    const t5 = new Team();
    t5.name = 'OS팀';
    t5.parent = t2;
    await this.teamRepository.manager.save(t5);

    const t6 = new Team();
    t6.name = 'CM1실';
    t6.parent = t3;
    await this.teamRepository.manager.save(t6);

    const t7 = new Team();
    t7.name = 'CM2실';
    t7.parent = t3;
    await this.teamRepository.manager.save(t7);

    const t8 = new Team();
    t8.name = 'CM1-1팀';
    t8.parent = t6;
    await this.teamRepository.manager.save(t8);

    const t9 = new Team();
    t9.name = 'CM1-2팀';
    t9.parent = t6;
    await this.teamRepository.manager.save(t9);

    const t10 = new Team();
    t10.name = 'CM2-1팀';
    t10.parent = t7;
    await this.teamRepository.manager.save(t10);

    const t11 = new Team();
    t11.name = 'CM2-2팀';
    t11.parent = t7;
    await this.teamRepository.manager.save(t11);
  }
}
