import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum ManagersRoleEnum {
  TEACHERS = 'TEACHERS',
  COORDINATORS = 'COORDINATORS',
}

export type ManagerDocument = Manager & Document;

@Schema({ timestamps: true })
export class Manager {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: ManagersRoleEnum })
  role: ManagersRoleEnum

  @Prop({ default: () => true })
  active: boolean;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);