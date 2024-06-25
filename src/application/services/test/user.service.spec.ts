import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../ports/inbound/user.service';

/**
 * user crud
 * user 렉쳐를 신청해야하고
 *
 *
 * */

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
