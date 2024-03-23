import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum UnityEnum {
  ITABUNA = 'ITABUNA',
  FEIRA_DE_SANTANA = 'FEIRA_DE_SANTANA',
  VITORIA_DA_CONQUISTA = 'VITORIA_DA_CONQUISTA',
  SALVADOR = 'SALVADOR',
  JEQUIÉ = 'JEQUIÉ',
}

export type StudentDocument = Student & Document;

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

  @Prop({ required: true, select: true, enum: UnityEnum })
  unity: UnityEnum;

  @Prop({ default: () => true })
  active: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

