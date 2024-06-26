import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from '../dto/create-lecture.dto';
import { LectureService } from '../ports/inbound/lecture.service';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { LectureRepository } from '../ports/outbound/lecture.repository';
import { Lecture } from '../../domain/entities/lecture.entity';

@Injectable()
export class LectureServiceImpl implements LectureService {
  constructor(private readonly lectureRepository: LectureRepository) {}

  // async apply(applyLectureDto: ApplyLectureDto): Promise<boolean> {

  //   // const status = await this.applicationRepository.apply(applyLectureDto);
  //   const lecture: Lecture = await this.lectureRepository.getLectureById(
  //     applyLectureDto.lectureId,
  //   );
  //   if (lecture.current_enrollment >= lecture.capacity) {
  //     return false;
  //   }
  //   lecture.current_enrollment++;
  //   await this.lectureRepository.createLecture(lecture);
  //   return true;
  // }

  async getAllLectures(): Promise<Lecture[]> {
    return await this.lectureRepository.getAllLectures();
  }

  async createLecture(createLectureDto: CreateLectureDto): Promise<Lecture> {
    return await this.lectureRepository.createLecture(createLectureDto);
  }

  async deleteLecture(id: number): Promise<void> {
    return await this.lectureRepository.deleteLecture(id);
  }

  // 특정 필터 조건에 맞는 Lecture 데이터를 조회
  // async findWithFilter(filter: Partial<Lecture>): Promise<Lecture[]> {
  //   return this.lectureRepository.find({ where: filter });
  // }

  //이거 생각해보니 여기서 하는거 아니네 이결과값은 중간테이블서 ㄱㄱ

  // async getApplicationStatus(userId: number) {
  //   this.lectureRepository.findOne(userId);
  //
  //   return Promise.resolve(true);
  // }
}
