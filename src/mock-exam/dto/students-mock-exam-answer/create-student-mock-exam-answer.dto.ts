import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentMockExamAnswerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  question_id: string;

  @ApiProperty({ required: true })
  selected_option_id: string | null;
}
