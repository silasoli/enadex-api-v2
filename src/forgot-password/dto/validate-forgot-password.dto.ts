import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o código' })
  otgCode: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o password do usuário.' })
  password: string;
}
