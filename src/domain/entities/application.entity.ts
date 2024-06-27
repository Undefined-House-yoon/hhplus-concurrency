import { Entity, ManyToOne, CreateDateColumn } from 'typeorm';
import { Lecture } from './lecture.entity';
import { CommonEntity } from './common.entity';
import { User } from './user.entity';

@Entity()
export class Application extends CommonEntity {
  @ManyToOne(() => User, user => user.requestedLectures)
  user: User;

  @ManyToOne(() => Lecture, lecture => lecture.requestedLectures)
  lecture: Lecture;

  @CreateDateColumn()
  timestamp: Date;
}
