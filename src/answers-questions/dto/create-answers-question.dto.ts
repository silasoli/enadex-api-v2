import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswersQuestionsDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  question_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  selected_option_id: string;
}
