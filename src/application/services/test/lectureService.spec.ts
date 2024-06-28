import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { LectureService } from '../../ports/inbound/lecture.service';
import { LectureRepository } from '../../ports/outbound/lecture.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from '../../../domain/entities/lecture.entity';
import { User } from '../../../domain/entities/user.entity';
import { Application } from '../../../domain/entities/application.entity';
import { LectureServiceImpl } from '../lecture.service.impl';
import { LectureRepositoryImpl } from '../../../infrastructure/adapters/out/lecture.repository.impl';
import { testTypeormConfig } from '../../../infrastructure/orm/typeorm.config';

describe('LectureService', () => {
  let service: LectureService;
  // let repository: LectureRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...testTypeormConfig,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([Lecture, User, Application]),
      ],
      providers: [
        { provide: LectureService, useClass: LectureServiceImpl },
        { provide: LectureRepository, useClass: LectureRepositoryImpl },
      ],
    }).compile();

    service = module.get<LectureService>(LectureService);
    // repository = module.get<LectureRepository>(LectureRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create a lecture', async () => {
    const lecture = await service.createLecture({
      title: 'Test Lecture',
      description: 'This is a test lecture',
      date: '2024-06-27',
      time: '10:00',
      capacity: 30,
    });

    expect(lecture).toBeDefined();
    expect(lecture.title).toEqual('Test Lecture');
  });

  it('should get all lectures', async () => {
    await service.createLecture({
      title: 'Lecture 1',
      description: 'Description 1',
      date: '2024-06-27',
      time: '10:00',
      capacity: 30,
    });
    await service.createLecture({
      title: 'Lecture 2',
      description: 'Description 2',
      date: '2024-06-28',
      time: '11:00',
      capacity: 25,
    });

    const lectures = await service.getAllLectures();
    expect(lectures.length).toBe(2);
  });

  it('should delete a lecture', async () => {
    const lecture = await service.createLecture({
      title: 'Lecture to Delete',
      description: 'This lecture will be deleted',
      date: '2024-06-27',
      time: '10:00',
      capacity: 30,
    });

    await service.deleteLecture(lecture.id);

    const lectures = await service.getAllLectures();
    expect(lectures.length).toBe(0);
  });
});
