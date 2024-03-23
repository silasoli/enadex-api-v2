import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UnityEnum } from '../schemas/student.entity';

export class CreateStudentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome do usuário.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o password do usuário.' })
  registration: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o password do usuário.' })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o password do usuário.' })
  semester: string;

  @ApiProperty({ required: true })
  @IsEnum(UnityEnum, { message: 'Cargo não encontrado no sistema.' })
  unity: string;
}
