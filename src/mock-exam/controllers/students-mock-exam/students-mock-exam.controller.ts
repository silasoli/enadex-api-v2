import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../../auth/guards/auth-user-jwt.guard';
import { IDQueryDTO } from '../../../common/dto/id-query.dto';
import { StudentsMockExamService } from '../../services/students-mock-exam/students-mock-exam.service';
import { CreateStudentMockExamDto } from '../../dto/students-mock-exam/create-student-mock-exam.dto';
import { UserRequest } from '../../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../../common/dto/user-request.dto';
import { StudentMockExamResponseDto } from '../../dto/students-mock-exam/mock-exam-response.dto';
import { MockExamQuestionResponseDto } from '../../dto/mock-exam-questions/mock-exam-question-response.dto';
import { StudentGuard } from '../../../roles/guards/student.guard';
import { MockExamResponseDto } from '../../dto/mock-exam/mock-exam-response.dto';

@ApiBearerAuth()
@ApiTags('Me Exams')
@Controller('me/exams')
@UseGuards(AuthUserJwtGuard, StudentGuard)
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

  @ApiOperation({ summary: 'Obter listagem de disponiveis' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de simulados retornada com sucesso',
    type: [MockExamResponseDto],
  })
  @Get('available')
  public findAllAvailable(
    @UserRequest() user: UserRequestDTO,
  ): Promise<MockExamResponseDto[]> {
    return this.service.findAllMockExamAvailable(user._id);
  }

  @ApiOperation({
    summary: 'Obter listagem de simulados em andamento do estudante logado',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listagem de simulados em andamento do estudante retornada com sucesso',
    type: [StudentMockExamResponseDto],
  })
  @Get('progress')
  public findAllOpened(
    @UserRequest() user: UserRequestDTO,
  ): Promise<StudentMockExamResponseDto[]> {
    return this.service.findAllOpened(user._id);
  }

  @ApiOperation({
    summary: 'Obter listagem de simulados finalizados do estudante logado',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listagem de simulados finalizados do estudante retornada com sucesso',
    type: [StudentMockExamResponseDto],
  })
  @Get('finished')
  public findAllFinished(
    @UserRequest() user: UserRequestDTO,
  ): Promise<StudentMockExamResponseDto[]> {
    return this.service.findAllFinished(user._id);
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


  @ApiOperation({ summary: 'Finalizar simulado do estudante' })
  @ApiResponse({
    status: 201,
    description: 'Simulado do estudante finalizado com sucesso',
    type: StudentMockExamResponseDto,
  })
  @Post(':id/finish')
  public finishStudentMockExam(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<StudentMockExamResponseDto> {
    return this.service.finishStudentMockExam(params.id, user._id);
  }

  @ApiOperation({ summary: 'Obter questões do simulado' })
  @ApiResponse({
    status: 200,
    description: 'Questões do simulado retornado com sucesso',
    type: [MockExamQuestionResponseDto],
  })
  @Get(':id/questions')
  public findQuestions(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<MockExamQuestionResponseDto[]> {
    return this.service.findQuestions(params.id, user._id);
  }
}
