import { Injectable } from '@nestjs/common';
import { ApplicationService } from '../ports/inbound/application.service';
import { Application } from '../../domain/entities/application.entity';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { UserRepository } from '../ports/outbound/user.repository';
import { LectureRepository } from '../ports/outbound/lecture.repository';
import { ApplicationRepository } from '../ports/outbound/application.repository';
import { DataSource } from 'typeorm';
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

  async applyLecture(applyLectureDto: ApplyLectureDto) {
    this.dataSource.manager.transaction('SERIALIZABLE', async (transactionalEntityManager) => {
    const application = new Application();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // 촉은 유저 렉처 조회 이후에 걸까 싶은데 보수적으로 선적용했습니다.
    try {
      // const user = await this.userRepository.getUserById(
      //   applyLectureDto.userId,
      // );
      // const lecture = await this.lectureRepository.getLectureById(
      //   applyLectureDto.lectureId,
      // );
      const user = await queryRunner.manager.findOne(User, {
        where: { id: applyLectureDto.userId },
      });
      const lecture = await queryRunner.manager.findOne(Lecture, {
        where: { id: applyLectureDto.lectureId },
      });
      if (!user || !lecture) {
        await queryRunner.rollbackTransaction();
        return false;
      }

      // 트랜잭션 내에서 인크리먼트 실행
      const isEnrolled =
        await this.lectureRepository.incrementEnrollment(lecture);
      if (isEnrolled) {
        application.lecture = lecture;
        application.user = user;
        await this.applicationRepository.apply(application);
        await queryRunner.commitTransaction();
        return true;
      }
      await queryRunner.rollbackTransaction();
      return false;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
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
