import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsIn, IsEnum, IsOptional } from 'class-validator';
import { UnityEnum } from '../../students/schemas/student.entity';

export class UpdateProfileDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty({ message: 'É necessário informar o nome do usuário.' })
  name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty({ message: 'É necessário informar o semestre do usuário.' })
  @IsIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], {
    message: 'O semestre deve ser 1, 2, 3, 4, 5, 6, 7, 8, 9 e 10.',
  })
  semester: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNotEmpty({ message: 'É necessário informar a unidade do usuário.' })
  @IsEnum(UnityEnum, { message: 'Unidade não encontrada no sistema.' })
  unity: string;
}
