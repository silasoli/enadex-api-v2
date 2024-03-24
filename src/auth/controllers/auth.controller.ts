import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserLoginResponseDto } from '../dto/user-login-response.dto';

@ApiTags('Session')
@Controller('session')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 201,
    description: 'Conta de usuário logada com sucesso',
    type: UserLoginResponseDto
  })
  @ApiBody({ type: UserLoginDto })
  @Post()
  public create(@Body() dto: UserLoginDto): Promise<UserLoginResponseDto> {
    return this.authService.authenticateUser(dto);
  }
}
