import { Test, TestingModule } from '@nestjs/testing';
import { MockExamService } from './mock-exam.service';

describe('MockExamService', () => {
  let service: MockExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockExamService],
    }).compile();

    service = module.get<MockExamService>(MockExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
