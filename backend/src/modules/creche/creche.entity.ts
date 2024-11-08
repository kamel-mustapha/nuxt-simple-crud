import { BaseEntity } from 'src/common/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Kid } from '../kid/kid.entity';

@Entity({ name: 'creches' })
export class Creche extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.creches)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Kid, (kid) => kid.creches)
  @JoinTable()
  kids: Kid[];
}
