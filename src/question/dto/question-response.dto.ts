import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../schema/question.entity';

export class StatementPartResponseDto {
  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  description: string;
}

export class OptionPartResponseDto {
  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  correctOption: boolean;
}

export class QuestionResponseDto {
  constructor(question: Question) {
    Object.assign(this, question);
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true, type: [StatementPartResponseDto] })
  statements: StatementPartResponseDto[];

  @ApiProperty({ required: true, type: [OptionPartResponseDto] })
  options: OptionPartResponseDto[];

  @ApiProperty({ required: true })
  isSpecific: boolean;

  @ApiProperty({ required: true })
  active: boolean;

  @ApiProperty({ required: true })
  sketch: boolean;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;
}
