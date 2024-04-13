import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { CreateForgotPasswordDto } from '../dto/create-forgot-password.dto';
import { ValidateForgotPasswordDto } from '../dto/validate-forgot-password.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Forgot Password')
@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Post('/request')
  public forgotPassword(@Body() dto: CreateForgotPasswordDto): Promise<any> {
    return this.forgotPasswordService.create(dto);
  }

  @ApiOperation({ summary: 'Validar recuperação de senha' })
  @ApiResponse({
    status: 204,
  })
  @HttpCode(204)
  @Post('/validate')
  public validateOTG(@Body() dto: ValidateForgotPasswordDto): Promise<any> {
    return this.forgotPasswordService.validate(dto);
  }
}
