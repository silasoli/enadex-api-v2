import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Course } from '../../courses/schema/course.entity';

export type QuestionDocument = Question & Document;

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
export class Question {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, minlength: 1, type: [StatementPart] })
  statements: StatementPart[];

  @Prop({ required: true, minlength: 5, type: [OptionPart] })
  options: OptionPart[];

  @Prop({ minlength: 4, maxlength: 4 })
  year: string | null;

  @Prop({ required: true, default: true })
  isSpecific: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false,
  })
  course_id: Course | null;

  @Prop({ required: true, default: true })
  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
