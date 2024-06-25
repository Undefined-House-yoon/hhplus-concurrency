import { LectureRepository } from '../../../application/ports/outbound/lecture.repository';
import { CreateLectureDto } from '../../../application/dto/create-lecture.dto';
import { Lecture } from '../../../domain/entities/lecture.entity';
import { UpdateLectureDto } from '../../../application/dto/update-lecture.dto';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class LectureRepositoryImpl
  extends Repository<Lecture>
  implements LectureRepository
{
  constructor(private dataSource: DataSource) {
    super(Lecture, dataSource.createEntityManager());
  }

  async createLecture(createLectureDto: CreateLectureDto): Promise<Lecture> {
    const lecture = this.create(createLectureDto);
    return await this.save(lecture);
  }

  async deleteLecture(id: number): Promise<void> {
    await this.delete(id);
  }

  async getAllLectures(): Promise<Lecture[]> {
    return this.find();
  }

  async getLectureById(id: number): Promise<Lecture> {
    return await this.findOneBy({ id: id });
  }

  async updateLecture(
    id: number,
    updateLectureDto: UpdateLectureDto,
  ): Promise<void> {
    await this.update(id, updateLectureDto);
  }

  async incrementEnrollment(id: number): Promise<void> {
    const lecture = await this.findOneBy({ id: id });
    if (lecture.enroll()) {
      await this.save(lecture);
      return;
    }
    return;
  }
}
