import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Course } from '../../courses/schema/course.entity';

export enum UnityEnum {
  ITABUNA = 'ITABUNA',
  FEIRA_DE_SANTANA = 'FEIRA_DE_SANTANA',
  VITORIA_DA_CONQUISTA = 'VITORIA_DA_CONQUISTA',
  SALVADOR = 'SALVADOR',
  JEQUIÉ = 'JEQUIÉ',
}

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true, lowercase: true })
  registration: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, select: true })
  semester: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course_id: Course;

  @Prop({ required: true, select: true, enum: UnityEnum })
  unity: UnityEnum;

  @Prop({ default: () => false })
  approved: boolean;

  @Prop({ default: () => false })
  active: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
