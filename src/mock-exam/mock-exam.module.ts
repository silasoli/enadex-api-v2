import { Module } from '@nestjs/common';
import { MockExamService } from './services/mock-exam/mock-exam.service';
import { MockExamController } from './controllers/mock-exam/mock-exam.controller';
import { MockExam, MockExamSchema } from './schemas/mock-exam.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsMockExamService } from './services/students-mock-exam/students-mock-exam.service';
import {
  StudentsMockExam,
  StudentsMockExamSchema,
} from './schemas/students-mock-exam.entity';
import { StudentsMockExamController } from './controllers/students-mock-exam/students-mock-exam.controller';
import { MockExamQuestionsController } from './controllers/mock-exam-questions/mock-exam-questions.controller';
import { MockExamQuestionsService } from './services/mock-exam-questions/mock-exam-questions.service';
import {
  MockExamQuestion,
  MockExamQuestionSchema,
} from './schemas/mock-exam-question.entity';
import { StudentsMockExamAnswerService } from './services/students-mock-exam-answer/students-mock-exam-answer.service';
import {
  StudentMockExamAnswer,
  StudentMockExamAnswerSchema,
} from './schemas/students-mock-exam-answer.entity';
import { StudentsMockExamAnswerController } from './controllers/students-mock-exam-answer/students-mock-exam-answer.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MockExam.name, schema: MockExamSchema },
      { name: MockExamQuestion.name, schema: MockExamQuestionSchema },
      { name: StudentsMockExam.name, schema: StudentsMockExamSchema },
      { name: StudentMockExamAnswer.name, schema: StudentMockExamAnswerSchema },
    ]),
  ],
  controllers: [
    MockExamController,
    StudentsMockExamController,
    MockExamQuestionsController,
    StudentsMockExamAnswerController,
  ],
  providers: [
    MockExamService,
    StudentsMockExamService,
    MockExamQuestionsService,
    StudentsMockExamAnswerService,
  ],
})
export class MockExamModule {}
