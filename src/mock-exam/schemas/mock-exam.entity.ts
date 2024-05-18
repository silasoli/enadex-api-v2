import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Course } from '../../courses/schema/course.entity';

export type MockExamDocument = MockExam & Document;

@Schema({ timestamps: true })
export class MockExam {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course_id: Course;

  @Prop({ default: () => false })
  available: boolean;

  @Prop({ required: true })
  duration: number; // Duração em segundos

  @Prop({ default: () => false })
  finished: boolean;

  @Prop({ default: () => null })
  finishedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export const MockExamSchema = SchemaFactory.createForClass(MockExam);
