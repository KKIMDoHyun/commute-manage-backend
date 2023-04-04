import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Dayjs } from 'dayjs';
import { PositionType } from 'src/auth/type/position.type';
import { CommuteRecord } from 'src/commute_records/entity/commute_record.entity';

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

  @Column()
  team: string;

  @Column()
  position: PositionType;

  @OneToMany(() => CommuteRecord, (commuteRecord) => commuteRecord.user, {
    eager: true,
  })
  commuteRecord: CommuteRecord[];
}
