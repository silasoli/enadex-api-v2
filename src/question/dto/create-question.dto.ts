import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
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
  @ValidateIf((object) => !object.sketch)
  @ArrayMinSize(1, {
    message: 'Uma questão deve conter pelo menos 1 enunciado',
  })
  @ArrayMaxSize(5, {})
  @ValidateNested()
  @Type(() => StatementPartDto)
  statements: StatementPartDto[];

  @ApiProperty({ required: true, type: [OptionPartDto] })
  @ValidateIf((object) => !object.sketch)
  @ArrayMinSize(2, {
    message: 'Uma questão deve conter pelo menos 2 alternativas',
  })
  @ArrayMaxSize(5, {})
  @ValidateNested()
  @Type(() => OptionPartDto)
  options: OptionPartDto[];

  @ApiProperty({ required: true })
  @ValidateIf((object) => !object.sketch)
  @IsNotEmpty()
  @IsBoolean()
  isSpecific: boolean;

  @ApiProperty({ required: true })
  @ValidateIf((object) => !object.sketch)
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @ApiProperty({ required: true })
  @ValidateIf((object) => !object.sketch)
  @IsNotEmpty()
  @IsBoolean()
  sketch: boolean;
}


