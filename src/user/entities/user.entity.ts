import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { Application } from '../../application/entities/application.entity';

@Entity()
export class User extends CommonEntity {
  @Column()
  username: string;

  @OneToMany(() => Application, requestedLectures => requestedLectures.user)
  requestedLectures: Application[];
}
