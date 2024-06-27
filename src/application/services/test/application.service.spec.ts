import { ApplicationService } from '../../ports/inbound/application.service';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../domain/entities/user.entity';
import { mysqlConfig } from '../../../infrastructure/orm/typeorm.config';
import { Lecture } from '../../../domain/entities/lecture.entity';
import { Application } from '../../../domain/entities/application.entity';
import { ApplicationServiceImpl } from '../application.service.impl';
import { UserRepositoryImpl } from '../../../infrastructure/adapters/out/user.repository.impl';
import { LectureRepositoryImpl } from '../../../infrastructure/adapters/out/lecture.repository.impl';
import { ApplicationRepositoryImpl } from '../../../infrastructure/adapters/out/application.repository.impl';
import { UserRepository } from '../../ports/outbound/user.repository';
import { LectureRepository } from '../../ports/outbound/lecture.repository';
import { ApplicationRepository } from '../../ports/outbound/application.repository';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let userRepository: UserRepository;
  let lectureRepository: LectureRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '1234',
          database: 'test',
          entities: [User, Lecture, Application],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Lecture, Application]),
      ],
      providers: [
        { provide: ApplicationService, useClass: ApplicationServiceImpl },
        { provide: UserRepository, useClass: UserRepositoryImpl },
        { provide: LectureRepository, useClass: LectureRepositoryImpl },
        { provide: ApplicationRepository, useClass: ApplicationRepositoryImpl },
      ],
    }).compile();
    userRepository = module.get<UserRepository>(UserRepository);
    lectureRepository = module.get<LectureRepository>(LectureRepository);
    service = module.get<ApplicationService>(ApplicationService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0'); // 외래 키 검사 비활성화

    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1'); // 외래 키 검사 활성화
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should apply for a lecture', async () => {
    const user = await userRepository.createUser({ username: 'test_user' });
    const lecture = await lectureRepository.createLecture({
      title: 'Test Lecture',
      description: 'This is a test lecture',
      date: '2024-06-27',
      time: '10:00',
    });

    const applyLectureDto = { userId: user.id, lectureId: lecture.id };
    const result = await service.applyLecture(applyLectureDto);

    expect(result).toBe(true);
  });

  it('should a lot of people need apply for a lecture', async () => {
    const users: User[] = [];
    for (let i = 0; i < 30; i++) {
      const user = await userRepository.createUser({ username: 'test_user' });
      users.push(user);
    }
    const capacity = 5;
    const lecture = await lectureRepository.createLecture({
      title: 'Test Lecture',
      description: 'This is a test lecture',
      date: '2024-06-27',
      time: '10:00',
      capacity: capacity,
    });
    const applyLectureDtoList = users.map(user => ({
      userId: user.id,
      lectureId: lecture.id,
    }));

    const applyPromises = applyLectureDtoList.map(applyLectureDto =>
      service.applyLecture(applyLectureDto),
    );
    const results = await Promise.all(applyPromises);
    //깔깔깔깔 어머 다들어 가네  <<<<<<< 내 함수 어디갔니?
    // results.forEach(result => expect(result).toBe(true));
    expect(results.length).toBe(capacity);
  });

  it('should check if a user has applied for a lecture', async () => {
    const user = await userRepository.createUser({ username: 'test_user' });
    const lecture = await lectureRepository.createLecture({
      title: 'Test Lecture',
      description: 'This is a test lecture',
      date: '2024-06-27',
      time: '10:00',
    });

    const applyLectureDto = { userId: user.id, lectureId: lecture.id };
    await service.applyLecture(applyLectureDto);

    const hasApplied = await service.hasUserAppliedForLecture(
      user.id,
      lecture.id,
    );
    expect(hasApplied).toBe(true);

    const hasNotApplied = await service.hasUserAppliedForLecture(
      user.id,
      lecture.id + 1,
    );
    expect(hasNotApplied).toBe(false);
  });
});
