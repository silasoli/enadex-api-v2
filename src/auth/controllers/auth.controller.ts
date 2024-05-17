import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserLoginResponseDto } from '../dto/user-login-response.dto';
import { StudentsRegisterService } from '../../students/services/students-register.service';
import { CreateStudentDto } from '../../students/dto/create-student.dto';
import { StudentResponseDto } from '../../students/dto/student-response.dto';

@ApiTags('Session')
@Controller('session')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly studentsRegisterService: StudentsRegisterService,
  ) {}

  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 201,
    description: 'Conta de usuário logada com sucesso',
    type: UserLoginResponseDto,
  })
  @ApiBody({ type: UserLoginDto })
  @Post('signin')
  public signIn(@Body() dto: UserLoginDto): Promise<UserLoginResponseDto> {
    return this.authService.authenticateUser(dto);
  }

  @ApiOperation({ summary: 'Realizar cadastro' })
  @ApiResponse({
    status: 201,
    description: 'Conta de usuário criada com sucesso',
  })
  @ApiBody({ type: CreateStudentDto })
  @Post('signup')
  public signUp(@Body() dto: CreateStudentDto): Promise<StudentResponseDto> {
    return this.studentsRegisterService.createStudentRegister(dto);
  }
}
