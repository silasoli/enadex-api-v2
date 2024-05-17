import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;
}
