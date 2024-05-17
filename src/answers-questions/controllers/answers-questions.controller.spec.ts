import { Test, TestingModule } from '@nestjs/testing';
import { AnswersQuestionsController } from './answers-questions.controller';
import { AnswersQuestionsService } from '../services/answers-questions.service';

describe('AnswersQuestionsController', () => {
  let controller: AnswersQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswersQuestionsController],
      providers: [AnswersQuestionsService],
    }).compile();

    controller = module.get<AnswersQuestionsController>(
      AnswersQuestionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
