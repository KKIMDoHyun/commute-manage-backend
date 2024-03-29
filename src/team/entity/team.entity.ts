import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.team, {
    eager: false,
  })
  user: User[];

  @TreeChildren({ cascade: true })
  children: Team[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Team;
}
