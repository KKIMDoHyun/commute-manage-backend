import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Dayjs } from 'dayjs';
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
}
