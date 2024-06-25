import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Application } from './application.entity';

@Entity()
export class User extends CommonEntity {
  @Column()
  username: string;

  @OneToMany(() => Application, requestedLectures => requestedLectures.user)
  requestedLectures: Application[];
}
