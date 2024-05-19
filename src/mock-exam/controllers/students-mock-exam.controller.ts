import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import { StudentsMockExamService } from '../services/students-mock-exam.service';
import { CreateStudentMockExamDto } from '../dto/students-mock-exam/create-student-mock-exam.dto';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../common/dto/user-request.dto';
import { StudentMockExamResponseDto } from '../dto/students-mock-exam/mock-exam-response.dto';

@ApiBearerAuth()
@ApiTags('Me Mock Exams')
@Controller('me/exams')
@UseGuards(AuthUserJwtGuard)
export class StudentsMockExamController {
  constructor(private readonly service: StudentsMockExamService) {}

  @ApiOperation({ summary: 'Iniciar simulado do estudante logado' })
  @ApiResponse({
    status: 201,
    description: 'Simulado criado com sucesso',
    type: StudentMockExamResponseDto,
  })
  @ApiBody({ type: CreateStudentMockExamDto })
  @Post()
  public create(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: CreateStudentMockExamDto,
  ): Promise<StudentMockExamResponseDto> {
    return this.service.create(user._id, dto);
  }

  @ApiOperation({ summary: 'Obter listagem de simulados do estudante logado' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de simulados do estudante retornada com sucesso',
    type: [StudentMockExamResponseDto],
  })
  @Get()
  public findAll(
    @UserRequest() user: UserRequestDTO,
  ): Promise<StudentMockExamResponseDto[]> {
    return this.service.findAll(user._id);
  }

  @ApiOperation({ summary: 'Obter simulado do estudante' })
  @ApiResponse({
    status: 200,
    description: 'Simulado do estudante retornado com sucesso',
    type: StudentMockExamResponseDto,
  })
  @Get(':id')
  public findOne(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<StudentMockExamResponseDto> {
    return this.service.findById(params.id, user._id);
  }

  // @ApiOperation({ summary: 'Editar simulado do estudante logado' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Editar da conta do usuário realizada com sucesso',
  //   type: StudentMockExamResponseDto,
  // })
  // @ApiBody({ type: UpdateStudentMockExamDto })
  // @Patch(':id')
  // update(
  //   @Param() params: IDQueryDTO,
  //   @UserRequest() user: UserRequestDTO,
  //   @Body() dto: UpdateStudentMockExamDto,
  // ): Promise<StudentMockExamResponseDto> {
  //   return this.service.update(params.id, user._id, dto);
  // }
}
