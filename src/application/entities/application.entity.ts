import { Entity, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { Lecture } from '../../lecture/entities/lecture.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Application extends CommonEntity {
  @ManyToOne(() => User, user => user.requestedLectures)
  user: User;

  @ManyToOne(() => Lecture, lecture => lecture.requestedLectures)
  lecture: Lecture;

  @CreateDateColumn()
  timestamp: Date;
}
