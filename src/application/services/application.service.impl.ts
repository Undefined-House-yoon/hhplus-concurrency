import { Injectable } from '@nestjs/common';
import { ApplicationService } from '../ports/inbound/application.service';
import { Application } from '../../domain/entities/application.entity';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { UserRepository } from '../ports/outbound/user.repository';
import { LectureRepository } from '../ports/outbound/lecture.repository';
import { ApplicationRepository } from '../ports/outbound/application.repository';
import { DataSource, QueryRunner } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { Lecture } from '../../domain/entities/lecture.entity';

@Injectable()
export class ApplicationServiceImpl implements ApplicationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly lectureRepository: LectureRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly dataSource: DataSource, // DataSource 주입
  ) {}

  private async executeInTransaction<T>(
    queryRunner: QueryRunner,
    callback: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    let isTransactionStarted = false;
    if (!queryRunner.isTransactionActive) {
      await queryRunner.startTransaction('SERIALIZABLE');
      isTransactionStarted = true;
    }

    try {
      const result = await callback(queryRunner);
      if (isTransactionStarted) {
        await queryRunner.commitTransaction();
      }
      return result;
    } catch (error) {
      if (isTransactionStarted) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    }
  }

  private async retryTransaction<T>(
    fn: () => Promise<T>,
    retries: number = 3,
  ): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === retries - 1) {
          throw error;
        }
        attempt++;
      }
    }
  }

  async applyLecture(applyLectureDto: ApplyLectureDto): Promise<boolean> {
    return this.retryTransaction(async () => {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        return await this.executeInTransaction(queryRunner, async qr => {
          const user = await qr.manager.findOne(User, {
            where: { id: applyLectureDto.userId },
          });
          const lecture = await qr.manager.findOne(Lecture, {
            where: { id: applyLectureDto.lectureId },
          });

          if (!user || !lecture) {
            return false;
          }

          if (lecture.currentEnrollment < lecture.capacity) {
            lecture.currentEnrollment++;
            await qr.manager.save(lecture);

            const application = new Application();
            application.lecture = lecture;
            application.user = user;
            await qr.manager.save(application);
            return true;
          } else {
            return false;
          }
        });
      } finally {
        await queryRunner.release();
      }
    });
  }

  async hasUserAppliedForLecture(
    userId: number,
    lectureId: number,
  ): Promise<boolean> {
    return this.applicationRepository.hasUserAppliedForLecture(
      userId,
      lectureId,
    );
  }
}

//
//createLecture(createLectureDto: CreateLectureDto): Promise<Lecture>;
//   applyLecture(lectureId: number): Promise<boolean>;

// // application/infrastructure/services/application.service.impl.ts
// import { Injectable } from '@nestjs/common';
// import { CreateApplicationDto } from '../../domain/dto/create-application.dto';
// import { UpdateApplicationDto } from '../../domain/dto/update-application.dto';
// import { ApplicationService } from '../../domain/services/application.service';
// import { Application } from '../../domain/entities/application.entity';
// import { ApplicationRepository } from '../../domain/repositories/application.repository';
//
// @Injectable()
// export class ApplicationServiceImpl implements ApplicationService {
//   constructor(
//     private readonly applicationRepository: ApplicationRepository,
//   ) {}
//
//   async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
//     const application = new Application();
//     application.name = createApplicationDto.name;
//     application.description = createApplicationDto.description;
//     return this.applicationRepository.save(application);
//   }
//
//   async findById(id: number): Promise<Application | undefined> {
//     return this.applicationRepository.findById(id);
//   }
//
//   async update(id: number, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
//     const application = await this.applicationRepository.findById(id);
//     if (application) {
//       application.name = updateApplicationDto.name;
//       application.description = updateApplicationDto.description;
//       return this.applicationRepository.save(application);
//     }
//     return undefined;
//   }
// }
