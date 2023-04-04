import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dayjs } from 'dayjs';
import { User } from 'src/auth/entity/user.entity';
@Entity()
export class CommuteRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Dayjs;

  @Column({ type: 'date' })
  today_date: string;

  @Column({ type: 'datetime', default: null })
  arrive_time: Dayjs;

  @Column({ type: 'datetime', default: null })
  leave_time: Dayjs;

  @Column({ default: 0 })
  work_time: number;

  @Column({ default: false })
  is_am: boolean;

  @Column({ default: false })
  is_pm: boolean;

  @Column({ default: false })
  is_full: boolean;

  @ManyToOne(() => User, (user) => user.commuteRecord, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
