import { Module } from '@nestjs/common';
import { MockExamService } from './services/mock-exam.service';
import { MockExamController } from './controllers/mock-exam.controller';
import { MockExam, MockExamSchema } from './schemas/mock-exam.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MockExam.name, schema: MockExamSchema },
    ]),
  ],
  controllers: [MockExamController],
  providers: [MockExamService],
})
export class MockExamModule {}
