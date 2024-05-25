import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { MockExamQuestion } from '../../schemas/mock-exam-question.entity';

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

export class MockExamQuestionResponseDto {
  constructor(question: MockExamQuestion) {
    return question;
  }

  @ApiProperty({ required: true, example: 'string' })
  _id?: mongoose.ObjectId | string;

  @ApiProperty({ required: true, type: [StatementPartResponseDto] })
  statements: StatementPartResponseDto[];

  @ApiProperty({ required: true, type: [OptionPartResponseDto] })
  options: OptionPartResponseDto[];

  @ApiProperty({ required: true })
  mock_exam_id: any;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;
}
