import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationServiceImpl } from '../application.service.impl';

describe('ApplicationService', () => {
  let service: ApplicationServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationServiceImpl],
    }).compile();

    service = module.get<ApplicationServiceImpl>(ApplicationServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
