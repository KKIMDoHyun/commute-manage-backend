import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pId: number;

  @OneToMany(() => User, (user) => user.team, {
    eager: true,
  })
  user: User[];
}
