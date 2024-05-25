import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MockExam } from './mock-exam.entity';

export type MockExamQuestionDocument = MockExamQuestion & Document;

@Schema()
export class StatementPart {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true })
  description: string;
  //@Prop()
  //img: string;
}

@Schema()
export class OptionPart {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: false })
  correctOption: boolean;
  //@Prop()
  //img: string;
}

@Schema({ timestamps: true })
export class MockExamQuestion {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, minlength: 1, type: [StatementPart] })
  statements: StatementPart[];

  @Prop({ required: true, minlength: 5, type: [OptionPart] })
  options: OptionPart[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockExam',
    required: true,
  })
  mock_exam_id: MockExam;

  createdAt: Date;

  updatedAt: Date;
}

export const MockExamQuestionSchema =
  SchemaFactory.createForClass(MockExamQuestion);
