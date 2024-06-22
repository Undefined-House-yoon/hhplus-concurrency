import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { Application } from '../../application/entities/application.entity';

@Entity()
export class Lecture extends CommonEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @OneToMany(() => Application, requestedLectures => requestedLectures.lecture)
  requestedLectures: Application[];

  @Column({ type: 'int', default: 30 })
  capacity: number;
}
