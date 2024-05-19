import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsNumber } from 'class-validator';

export class CreateMockExamDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome do simulado.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o curso.' })
  @IsMongoId({ message: 'O Curso deve ser valido. ' })
  course_id: string;

  @ApiProperty({ required: true, description: 'Duration in seconds' })
  @IsNumber({}, { message: 'A duração deve ser em segundos' })
  duration: number;
}
