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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MockExam.name, schema: MockExamSchema },
      { name: MockExamQuestion.name, schema: MockExamQuestionSchema },
      { name: StudentsMockExam.name, schema: StudentsMockExamSchema },
    ]),
  ],
  controllers: [
    MockExamController,
    StudentsMockExamController,
    MockExamQuestionsController,
  ],
  providers: [
    MockExamService,
    StudentsMockExamService,
    MockExamQuestionsService,
  ],
})
export class MockExamModule {}
