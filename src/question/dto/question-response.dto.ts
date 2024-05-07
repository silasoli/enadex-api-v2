import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../schema/question.entity';
import mongoose from 'mongoose';

export class StatementPartResponseDto {
  @ApiProperty({ required: true, example: 'string' })
  _id?: mongoose.ObjectId | string;

  @ApiProperty({ required: true })
  description: string;
}

export class CourseResponseDto {
  @ApiProperty({ required: true, example: 'string' })
  _id?: mongoose.ObjectId | string;

  @ApiProperty({ required: true })
  name: string;
}

export class OptionPartResponseDto {
  @ApiProperty({ required: true, example: 'string' })
  _id?: mongoose.ObjectId | string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  correctOption: boolean;
}

export class QuestionResponseDto {
  constructor(question: Question) {
    return question;
  }

  @ApiProperty({ required: true, example: 'string' })
  _id?: mongoose.ObjectId | string;

  @ApiProperty({ required: true, type: [StatementPartResponseDto] })
  statements: StatementPartResponseDto[];

  @ApiProperty({ required: true, type: [OptionPartResponseDto] })
  options: OptionPartResponseDto[];

  @ApiProperty({ required: true })
  isSpecific: boolean;

  @ApiProperty({ required: true, type: CourseResponseDto })
  course_id: CourseResponseDto;

  @ApiProperty({ required: true })
  active: boolean;

  @ApiProperty({ required: true })
  sketch: boolean;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;
}
