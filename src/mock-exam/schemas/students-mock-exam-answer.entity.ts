import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MockExamQuestion } from './mock-exam-question.entity';
import { MockExam } from './mock-exam.entity';
import { StudentsMockExam } from './students-mock-exam.entity';

export type StudentMockExamAnswerDocument = StudentMockExamAnswer & Document;

@Schema()
export class StudentMockExamAnswer {
  _id?: mongoose.ObjectId | string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockExamQuestion',
  })
  question_id: MockExamQuestion;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockExam',
  })
  mock_exam_id: MockExam;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentsMockExam',
  })
  exam_id: StudentsMockExam;

  @Prop({ required: true })
  student_id: string;

  @Prop({ required: true })
  selected_option_id: string;
}

export const StudentMockExamAnswerSchema = SchemaFactory.createForClass(
  StudentMockExamAnswer,
);
