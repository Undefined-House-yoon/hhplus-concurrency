import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { LectureService } from '../src/lecture/lecture.service';

describe('LectureController (e2e)', () => {
  let app: INestApplication;
  const lectureService = {
    applyLecture: jest.fn(),
    getApplicationStatus: jest.fn(),
    getLectures: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LectureService)
      .useValue(lectureService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/lectures/apply (POST)', () => {
    it('should 성공적으로 강의를 신청해야 합니다', async () => {
      lectureService.applyLecture.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send({ userId: 1, lectureId: 1 })
        .expect(201);

      expect(response.body).toEqual({});
      expect(lectureService.applyLecture).toHaveBeenCalledWith({
        userId: 1,
        lectureId: 1,
      });
    });

    it('should throw 강의가 꽉 차면 오류가 발생해야 합니다', async () => {
      lectureService.applyLecture.mockRejectedValue(
        new Error('Lecture capacity full.'),
      );

      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send({ userId: 1, lectureId: 1 })
        .expect(400);

      expect(response.body.message).toBe('Lecture capacity full.');
    });

    it('should throw 사용자가 이미 신청한 경우 오류가 발생해야 합니다.', async () => {
      lectureService.applyLecture.mockRejectedValue(
        new Error('User has already applied for the lecture.'),
      );

      const response = await request(app.getHttpServer())
        .post('/lectures/apply')
        .send({ userId: 1, lectureId: 1 })
        .expect(400);

      expect(response.body.message).toBe(
        'User has already applied for the lecture.',
      );
    });
  });

  describe('/lectures/application/:userId/:lectureId (GET)', () => {
    it('should 사용자가 강의를 신청한 경우 true 를 반환해야 합니다.', async () => {
      lectureService.getApplicationStatus.mockResolvedValue(true);

      const response = await request(app.getHttpServer())
        .get('/lectures/application/1/1')
        .expect(200);

      expect(response.body).toBe(true);
      expect(lectureService.getApplicationStatus).toHaveBeenCalledWith(1, 1);
    });

    it('should 사용자가 강의를 신청하지 않은 경우 false를 반환합니다.', async () => {
      lectureService.getApplicationStatus.mockResolvedValue(false);

      const response = await request(app.getHttpServer())
        .get('/lectures/application/1/1')
        .expect(200);

      expect(response.body).toBe(false);
      expect(lectureService.getApplicationStatus).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('/lectures (GET)', () => {
    it('should 강의 목록을 반환해야 합니다', async () => {
      const lectures = [
        {
          id: 1,
          title: 'Lecture 1',
          description: 'Description 1',
          date: '2023-04-20',
          time: '13:00:00',
          capacity: 30,
        },
      ];
      lectureService.getLectures.mockResolvedValue(lectures);

      const response = await request(app.getHttpServer())
        .get('/lectures')
        .expect(200);

      expect(response.body).toEqual(lectures);
      expect(lectureService.getLectures).toHaveBeenCalled();
    });
  });
});
