import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  emailAddress: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário enviar uma mensagem.' })
  message: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário enviar um título.' })
  title: string;
}
