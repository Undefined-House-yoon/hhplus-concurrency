import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Application } from './application.entity';

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

  @Column({ type: 'int', default: 0 })
  currentEnrollment: number;

  enroll(): boolean {
    if (this.currentEnrollment >= this.capacity) {
      return false;
    }
    this.currentEnrollment++;
    return true;
  }
}
