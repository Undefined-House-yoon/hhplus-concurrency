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

  async incrementEnrollment(lecture: Lecture): Promise<boolean> {
    // const lecture = await this.findOneBy({ id: id });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (lecture.enroll()) {
        await queryRunner.manager.save(lecture);
        await queryRunner.commitTransaction();
        return true;
      }
      await queryRunner.rollbackTransaction();
      return false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
