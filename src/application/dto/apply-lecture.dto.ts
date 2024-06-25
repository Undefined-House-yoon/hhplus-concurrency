import { IsInt } from 'class-validator';

export class ApplyLectureDto {
  @IsInt()
  userId: number;

  @IsInt()
  lectureId: number;
}
