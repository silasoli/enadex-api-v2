import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ForgotPasswordDocument = ForgotPassword & Document;

@Schema({ timestamps: true })
export class ForgotPassword {
  _id?: mongoose.ObjectId;

  @Prop({ lowercase: true })
  email: string;

  @Prop({ unique: true })
  otgCode: string;

  @Prop()
  usedAt: Date;

  @Prop({ default: false })
  invalid: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const ForgotPasswordSchema =
  SchemaFactory.createForClass(ForgotPassword);
