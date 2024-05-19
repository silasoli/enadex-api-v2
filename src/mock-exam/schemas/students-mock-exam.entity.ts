import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MockExam } from './mock-exam.entity';
import { Student } from '../../students/schemas/student.entity';

export type StudentsMockExamDocument = StudentsMockExam & Document;

@Schema({ timestamps: true })
export class StudentsMockExam {
  _id?: mongoose.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockExam',
    required: true,
  })
  mock_exam_id: MockExam;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  student_id: Student;

  @Prop({ default: () => false })
  finished: boolean;

  @Prop({ default: () => null })
  finishedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export const StudentsMockExamSchema =
  SchemaFactory.createForClass(StudentsMockExam);
