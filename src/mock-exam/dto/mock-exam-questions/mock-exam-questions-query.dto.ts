import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class MockExamQuestionQueryDto {
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
}
