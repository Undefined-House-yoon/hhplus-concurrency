import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly lectureRepository: LectureRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly dataSource: DataSource, // DataSource 주입
  ) {}

  async applyLecture(applyLectureDto: ApplyLectureDto): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE'); // 트랜잭션 격리 수준 설정

    try {
      this.logger.log('Transaction started');
      const user = await queryRunner.manager.findOne(User, {
        where: { id: applyLectureDto.userId },
      });

      if (!user) {
        await queryRunner.rollbackTransaction();
        this.logger.log('Transaction rolled back: User not found');
        return false;
      }

      const lecture = await queryRunner.manager.findOne(Lecture, {
        where: { id: applyLectureDto.lectureId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!lecture) {
        await queryRunner.rollbackTransaction();
        this.logger.log('Transaction rolled back: Lecture not found');
        return false;
      }

      if (lecture.currentEnrollment < lecture.capacity) {
        lecture.currentEnrollment++;
        await queryRunner.manager.save(lecture);

        const application = new Application();
        application.lecture = lecture;
        application.user = user;
        await queryRunner.manager.save(application);

        await queryRunner.commitTransaction(); // 트랜잭션 커밋, 락 해제
        this.logger.log('Transaction committed');
        return true;
      } else {
        await queryRunner.rollbackTransaction(); // 트랜잭션 롤백, 락 해제
        this.logger.log('Transaction rolled back: Lecture capacity full');
        return false;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction(); // 트랜잭션 롤백, 락 해제
      this.logger.error('Transaction rolled back: ' + error.message);
      throw error;
    } finally {
      await queryRunner.release(); // QueryRunner 해제
      this.logger.log('QueryRunner released');
    }
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
