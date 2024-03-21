import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class IDQueryDTO {
  @ApiProperty({ required: true, description: 'Envie um id válido do mongoDB' })
  @IsString({ message: 'O ID deve ser uma string.' })
  @IsNotEmpty({ message: 'O ID não pode estar vazio.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  id: string;
}
