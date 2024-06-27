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
    return this.dataSource.manager.transaction(
      'SERIALIZABLE',
      async transactionalEntityManager => {
        const user = await transactionalEntityManager.findOne(User, {
          where: { id: applyLectureDto.userId },
        });
        const lecture = await transactionalEntityManager.findOne(Lecture, {
          where: { id: applyLectureDto.lectureId },
        });

        if (!user || !lecture) {
          return false;
        }

        // 트랜잭션 내에서 업데이트
        if (lecture.currentEnrollment < lecture.capacity) {
          lecture.currentEnrollment++;
          await transactionalEntityManager.save(lecture);

          const application = new Application();
          application.lecture = lecture;
          application.user = user;
          await transactionalEntityManager.save(application);
          return true;
        } else {
          return false;
        }
      },
    );
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
