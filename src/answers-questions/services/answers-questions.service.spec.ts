import { Test, TestingModule } from '@nestjs/testing';
import { AnswersQuestionsService } from './answers-questions.service';

describe('AnswersQuestionsService', () => {
  let service: AnswersQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswersQuestionsService],
    }).compile();

    service = module.get<AnswersQuestionsService>(AnswersQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
