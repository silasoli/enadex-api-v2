import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { ManagersRoleEnum } from '../schemas/manager.entity';

export class CreateManagerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome do usuário.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o password do usuário.' })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o cargo do usuário.' })
  @IsEnum(ManagersRoleEnum, { message: 'Cargo não encontrado no sistema.' })
  role: ManagersRoleEnum;
}
