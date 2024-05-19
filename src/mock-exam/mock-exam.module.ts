import { Module } from '@nestjs/common';
import { MockExamService } from './services/mock-exam.service';
import { MockExamController } from './controllers/mock-exam.controller';
import { MockExam, MockExamSchema } from './schemas/mock-exam.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsMockExamService } from './services/students-mock-exam.service';
import {
  StudentsMockExam,
  StudentsMockExamSchema,
} from './schemas/students-mock-exam.entity';
import { StudentsMockExamController } from './controllers/students-mock-exam.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MockExam.name, schema: MockExamSchema },
      { name: StudentsMockExam.name, schema: StudentsMockExamSchema },
    ]),
  ],
  controllers: [MockExamController, StudentsMockExamController],
  providers: [MockExamService, StudentsMockExamService],
})
export class MockExamModule {}
