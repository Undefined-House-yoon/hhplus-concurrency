import { CreateLectureDto } from '../../dto/create-lecture.dto';
import { Lecture } from '../../../domain/entities/lecture.entity';
import { UpdateLectureDto } from '../../dto/update-lecture.dto';

export abstract class LectureRepository {
  abstract createLecture(createLectureDto: CreateLectureDto): Promise<Lecture>;

  abstract getAllLectures(): Promise<Lecture[]>;

  abstract getLectureById(id: number): Promise<Lecture>;

  abstract updateLecture(
    id: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<void>;

  abstract deleteLecture(id: number): Promise<void>;

  abstract incrementEnrollment(lecture: Lecture): Promise<boolean>;
}
