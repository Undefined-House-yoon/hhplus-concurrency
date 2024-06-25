import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { LectureModule } from '../../../../lecture.module';
import { LectureService } from '../../../../application/ports/inbound/lecture.service';

describe('LectureController (e2e)', () => {
  let app: INestApplication;
  const lectureService = {
    apply: jest.fn(),
    getAllLectures: jest.fn(),
    getApplicationStatus: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LectureModule],
    })
      .overrideProvider(LectureService)
      .useValue(lectureService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST lectures/apply (apply for lecture)', () => {
    return request(app.getHttpServer())
      .post('/lectures/apply')
      .send({ userId: 1, lectureId: 1 })
      .expect(201)
      .expect(lectureService.apply);
  });

  it('/GET lectures (get all lectures)', () => {
    return request(app.getHttpServer())
      .get('/lectures')
      .expect(200)
      .expect(lectureService.getAllLectures);
  });

  it('/GET lectures/application/:userId (get application status)', () => {
    return request(app.getHttpServer())
      .get('/lectures/application/1')
      .expect(200)
      .expect(lectureService.getApplicationStatus);
  });

  afterAll(async () => {
    await app.close();
  });
});
