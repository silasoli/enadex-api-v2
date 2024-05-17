import { Module } from '@nestjs/common';
import { AnswersQuestionsService } from './services/answers-questions.service';
import { AnswersQuestionsController } from './controllers/answers-questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AnswerQuestions,
  AnswerQuestionsSchema,
} from './schemas/answers-question.entity';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnswerQuestions.name, schema: AnswerQuestionsSchema },
    ]),
    QuestionModule,
  ],
  controllers: [AnswersQuestionsController],
  providers: [AnswersQuestionsService],
})
export class AnswersQuestionsModule {}
