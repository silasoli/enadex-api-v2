import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  // @Prop({ default: () => true })
  // active: boolean;

  createdAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
