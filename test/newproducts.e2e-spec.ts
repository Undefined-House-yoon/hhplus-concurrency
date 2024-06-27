import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/domain/entities/user.entity';
import { Lecture } from '../src/domain/entities/lecture.entity';
import { Application } from '../src/domain/entities/application.entity';
import { AppModule } from '../src/app.module';

describe('ApplicationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'testuser',
          password: 'password',
          database: 'testdb',
          entities: [User, Lecture, Application],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/applications/apply (POST) - should apply for a lecture', async () => {
    // 사용자 생성
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'test_user' })
      .expect(201);

    const userId = userResponse.body.id;

    // 강의 생성
    const lectureResponse = await request(app.getHttpServer())
      .post('/lectures')
      .send({
        title: 'Test Lecture',
        description: 'This is a test lecture',
        date: '2024-06-27',
        time: '10:00',
        capacity: 5,
      })
      .expect(201);

    const lectureId = lectureResponse.body.id;

    // 강의 신청
    await request(app.getHttpServer())
      .post('/applications/apply')
      .send({ userId, lectureId })
      .expect(201)
      .expect(res => {
        expect(res.body).toEqual({ success: true });
      });
  });

  it('/applications/status/:userId (GET) - should get application status', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'test_user2' })
      .expect(201);

    const userId = userResponse.body.id;

    const lectureResponse = await request(app.getHttpServer())
      .post('/lectures')
      .send({
        title: 'Test Lecture 2',
        description: 'This is another test lecture',
        date: '2024-06-28',
        time: '11:00',
        capacity: 5,
      })
      .expect(201);

    const lectureId = lectureResponse.body.id;

    await request(app.getHttpServer())
      .post('/applications/apply')
      .send({ userId, lectureId })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/applications/status/${userId}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({ hasApplied: true });
      });
  });
});
