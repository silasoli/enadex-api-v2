import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class QuestionQueryDto {
  @ApiProperty({
    required: false,
    description: 'ID do curso para filtrar as questões.',
  })
  @IsOptional()
  @IsMongoId({ message: 'O ID do curso deve ser válido.' })
  course_id?: string;

  @ApiProperty({
    required: false,
    description: 'Texto para busca nos enunciados das questões.',
  })
  @IsOptional()
  @IsString({ message: 'O texto de busca deve ser uma string.' })
  @MinLength(1, {
    message: 'O texto de busca deve ter pelo menos 1 caractere.',
  })
  searchText?: string;

  @ApiProperty({ example: '2024' })
  @IsOptional()
  @MinLength(4, { message: 'O ano da questão deve conter 4 digitos.' })
  @MaxLength(4, { message: 'O ano da questão deve conter 4 digitos.' })
  @IsNumberString({}, { message: 'Deve conter apenas números' })
  year: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar por questões específicas ou não.',
    example: true,
  })
  @IsOptional()
  @IsBooleanString({
    message: 'O valor do filtro de isSpecific deve ser um booleano.',
  })
  isSpecific?: string;
}
