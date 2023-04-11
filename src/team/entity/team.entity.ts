import { User } from 'src/auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
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

  // @Column()
  // pId: number;

  @OneToMany(() => User, (user) => user.team, {
    eager: false,
    onDelete: 'CASCADE',
  })
  user: User[];

  @TreeChildren({ cascade: true })
  children: Team[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Team;
}
