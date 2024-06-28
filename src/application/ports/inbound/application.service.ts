import { ApplyLectureDto } from '../../dto/apply-lecture.dto';

export abstract class ApplicationService {
  abstract applyLecture(applyLectureDto: ApplyLectureDto): Promise<boolean>;

  abstract hasUserAppliedForLecture(
    userId: number,
    lectureId: number,
  ): Promise<boolean>;
}
