import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Dayjs } from 'dayjs';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';
import { Team } from 'src/team/entity/team.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Dayjs;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => CommuteRecord, (commuteRecord) => commuteRecord.user, {
    eager: true,
  })
  commuteRecord: CommuteRecord[];

  @ManyToOne(() => Team, (team) => team.user, { eager: false })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ default: false })
  isMaster: boolean;
}
