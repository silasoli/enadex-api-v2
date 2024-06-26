import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswersQuestionsDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  question_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  selected_option_id: string;
}
