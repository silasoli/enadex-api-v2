import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Question } from '../../question/schema/question.entity';

export type AnswerQuestionsDocument = AnswerQuestions & Document;

@Schema()
export class AnswerQuestions {
  _id?: mongoose.ObjectId | string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  })
  question_id: Question;

  @Prop({ required: true })
  student_id: string;

  @Prop({ required: true })
  selected_option_id: string;

  @Prop({ required: true })
  right_answer: boolean;
}

export const AnswerQuestionsSchema =
  SchemaFactory.createForClass(AnswerQuestions);
