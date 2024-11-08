import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Creche } from '../creche/creche.entity';

@Entity({ name: 'kids' })
export class Kid extends BaseEntity {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.kids, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Creche, (creche) => creche.kids, { eager: true })
  creches: Creche[];
}
