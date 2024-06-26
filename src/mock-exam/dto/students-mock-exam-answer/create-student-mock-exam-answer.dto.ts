import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateStudentMockExamAnswerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  question_id: string;

  @ApiProperty({ required: true })
  @ValidateIf((o) => o.selected_option_id !== null)
  @IsString()
  @IsMongoId()
  selected_option_id: string | null;
}
