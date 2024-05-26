import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class StatementPartDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Enunciado não deve estar em branco.' })
  description: string;
}
export class OptionPartDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Alternativa não deve estar em branco.' })
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  correctOption: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({ required: true, type: [StatementPartDto] })
  @ArrayMinSize(1, {
    message: 'Uma questão deve conter pelo menos 1 enunciado',
  })
  @ArrayMaxSize(5, {})
  @ValidateNested()
  @Type(() => StatementPartDto)
  statements: StatementPartDto[];

  @ApiProperty({ required: true, type: [OptionPartDto] })
  @ArrayMinSize(2, {
    message: 'Uma questão deve conter pelo menos 2 alternativas',
  })
  @ArrayMaxSize(5, {})
  @ValidateNested()
  @Type(() => OptionPartDto)
  options: OptionPartDto[];

  @ApiProperty({ example: '2024' })
  @MinLength(4, { message: 'O ano da questão deve conter 4 digitos.' })
  @MaxLength(4, { message: 'O ano da questão deve conter 4 digitos.' })
  @IsNumberString({}, { message: 'Deve conter apenas números' })
  year: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isSpecific: boolean;

  @ApiProperty({ required: true })
  @ValidateIf((object) => object.isSpecific)
  @IsNotEmpty()
  @IsMongoId()
  course_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
