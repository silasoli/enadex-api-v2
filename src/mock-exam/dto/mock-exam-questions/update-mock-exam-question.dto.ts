import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateMockExamQuestionDto } from './create-mock-exam-question.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStatementPartDto {
  @ApiProperty({ required: true })
  @IsOptional()
  _id?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  description?: string;
}
export class UpdateOptionPartDto {
  @ApiProperty({ required: true })
  @IsOptional()
  _id?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  correctOption?: boolean;
}

export class UpdateMockExamQuestionDto extends PartialType(
  OmitType(CreateMockExamQuestionDto, ['options', 'statements'] as const),
) {
  @ApiProperty({ required: true, type: [UpdateStatementPartDto] })
  @ValidateNested()
  @Type(() => UpdateStatementPartDto)
  @IsOptional()
  statements?: UpdateStatementPartDto[];

  @ApiProperty({ required: true, type: [UpdateOptionPartDto] })
  @ValidateNested()
  @Type(() => UpdateOptionPartDto)
  @IsOptional()
  options?: UpdateOptionPartDto[];
}
