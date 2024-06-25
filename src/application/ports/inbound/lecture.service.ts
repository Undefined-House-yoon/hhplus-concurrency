import { CreateLectureDto } from '../../dto/create-lecture.dto';
import { UpdateLectureDto } from '../../dto/update-lecture.dto';
import { Lecture } from '../../../domain/entities/lecture.entity';
import { ApplyLectureDto } from '../../dto/apply-lecture.dto';

export abstract class LectureService {
  //get
  abstract getAllLectures(): Promise<Lecture[]>;

  //post 아직 하지는 않았지만 이건 왠지 application에서 구현해야해
  // abstract apply(applyLectureDto: ApplyLectureDto): Promise<boolean>;

  //post
  abstract createLecture(createLectureDto: CreateLectureDto): Promise<Lecture>;

  abstract deleteLecture(id: number): Promise<void>;
  // //get
  // abstract getApplicationStatus(userId: number): Promise<boolean>;
}
