import { Module } from '@nestjs/common';
import { LectureController } from './infrastructure/adapters/in/lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './domain/entities/lecture.entity';
import { LectureService } from './application/ports/inbound/lecture.service';
import { LectureServiceImpl } from './application/services/lecture.service.impl';
import { LectureRepositoryImpl } from './infrastructure/adapters/out/lecture.repository.impl';
import { LectureRepository } from './application/ports/outbound/lecture.repository';
import { ApplicationRepository } from './application/ports/outbound/application.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  controllers: [LectureController],
  providers: [
    { provide: LectureService, useClass: LectureServiceImpl },
    { provide: LectureRepository, useClass: LectureRepositoryImpl },
    { provide: ApplicationRepository, useClass: LectureServiceImpl },
  ],
})
export class LectureModule {}
