import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Creche } from '../creche/creche.entity';
import { Kid } from '../kid/kid.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @OneToMany(() => Creche, (creche) => creche.user)
  creches: Creche[];

  @OneToMany(() => Kid, (kid) => kid.user)
  kids: Kid[];
}
