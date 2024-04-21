import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class StatementPart {
  @Prop({ required: true })
  description: string;
  //@Prop()
  //img: string;
}

@Schema()
export class OptionPart {
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

  @Prop({ required: true, default: true })
  isSpecific: boolean;
  //course: ObjectID

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ required: true, default: false })
  sketch: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
