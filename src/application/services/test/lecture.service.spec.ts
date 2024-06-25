import { Test, TestingModule } from '@nestjs/testing';
import { LectureServiceImpl } from '../lecture.service.impl';
import { LectureRepository } from '../../ports/outbound/lecture.repository';
import { LectureService } from '../../ports/inbound/lecture.service';
import { UserRepository } from '../../ports/outbound/user.repository';
import { LectureModule } from '../../../lecture.module';
import { ApplicationRepository } from '../../ports/outbound/application.repository';
import { LectureController } from '../../../infrastructure/adapters/in/lecture.controller';
import { ApplyLectureDto } from '../../dto/apply-lecture.dto';

describe('LectureService', () => {
  let service: LectureService;
  let lectureRepository: jest.Mocked<LectureRepository>;
  let applicationRepository: jest.Mocked<ApplicationRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LectureModule],
      controllers: [LectureController],
      providers: [
        {
          provide: LectureRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(['Lecture 1', 'Lecture 2']),
            findById: jest.fn(),
          },
        },
        {
          provide: 'ApplicationRepository',
          useValue: {
            findByUserAndLecture: jest.fn(),
            countByLecture: jest.fn(),
            save: jest.fn().mockResolvedValue({}),
            findByUserId: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LectureService>(LectureServiceImpl);
    lectureRepository = module.get('LectureRepository');
    applicationRepository = module.get('ApplicationRepository');
    userRepository = module.get('UserRepository');

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllLectures', () => {
    it('getAllLectures 메서드를 호출하여 모든 특강 목록을 반환하는지 확인합니다.', async () => {
      const lectures = await service.getAllLectures();
      expect(lectures).toEqual(['Lecture 1', 'Lecture 2']);
    });
  });

  describe('apply', () => {
    it('apply 메서드가 특강 신청을 제대로 처리하는지 테스트합니다.', async () => {
      const applyLectureDto: ApplyLectureDto = { userId: 1, lectureId: 1 };

      applicationRepository.findByUserAndLecture = jest
        .fn()
        .mockResolvedValue(null);
      lectureRepository.findById = jest
        .fn()
        .mockResolvedValue({ id: 1, title: 'Lecture 1' });
      applicationRepository.countByLecture = jest
        .fn()
        .mockResolvedValue(29);
      applicationRepository.save = jest.fn().mockResolvedValue({
        userId: 1,
        lectureId: 1,
      });

      const application = await service.apply(applyLectureDto);

      expect(application).toEqual({
        userId: 1,
        lectureId: 1,
      });
      expect(applicationRepository.save).toHaveBeenCalledWith({
        userId: 1,
        lectureId: 1,
      });
    });

    it('신청자가 이미 신청했을 경우를 테스트합니다.', async () => {
      const applyLectureDto: ApplyLectureDto = { userId: 1, lectureId: 1 };
      applicationRepository.findByUserAndLecture = jest
        .fn()
        .mockResolvedValue({});

      await expect(service.apply(applyLectureDto)).rejects.toThrow(
        'User has already applied for this lecture.',
      );
    });

    it('신청 정원이 초과된 경우에 대해 에러가 발생하는지 확인합니다.', async () => {
      const applyLectureDto: ApplyLectureDto = { userId: 1, lectureId: 1 };
      applicationRepository.findByUserAndLecture = jest
        .fn()
        .mockResolvedValue(null);
      lectureRepository.findById = jest
        .fn()
        .mockResolvedValue({ id: 1, title: 'Lecture 1' });
      applicationRepository.countByLecture = jest
        .fn()
        .mockResolvedValue(30);

      await expect(service.apply(applyLectureDto)).rejects.toThrow(
        'Lecture is fully booked.',
      );
    });
  });

  describe('getApplicationStatus', () => {
    it('사용자의 특강 신청 상태를 올바르게 반환하는지 테스트합니다.', async () => {
      const userId = 1;
      applicationRepository.findByUserId = jest
        .fn()
        .mockResolvedValue([{ lectureId: 1, appliedAt: new Date() }]);

      const applicationStatus = await service.getApplicationStatus(userId);

      expect(applicationStatus).toEqual({
        userId: 1,
        applications: [{ lectureId: 1, appliedAt: expect.any(Date) }],
      });
    });
  });
});
