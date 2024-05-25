import { Test, TestingModule } from '@nestjs/testing';
import { MockExamController } from './mock-exam.controller';
import { MockExamService } from '../../services/mock-exam/mock-exam.service';

describe('MockExamController', () => {
  let controller: MockExamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockExamController],
      providers: [MockExamService],
    }).compile();

    controller = module.get<MockExamController>(MockExamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
