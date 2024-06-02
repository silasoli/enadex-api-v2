import { Controller, Get, Body, Param, UseGuards, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../../auth/guards/auth-user-jwt.guard';
import { StudentsMockExamAnswerService } from '../../services/students-mock-exam-answer/students-mock-exam-answer.service';
import { UserRequest } from '../../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../../common/dto/user-request.dto';
import { IDQueryDTO } from '../../../common/dto/id-query.dto';
import { CreateStudentMockExamAnswerDto } from '../../dto/students-mock-exam-answer/create-student-mock-exam-answer.dto';
import { StudentMockExamAnswerResponseDto } from '../../dto/students-mock-exam-answer/students-mock-exam-answer-response.dto';

@ApiBearerAuth()
@ApiTags('Me Exams Answers')
@Controller('me/exams')
@UseGuards(AuthUserJwtGuard)
export class StudentsMockExamAnswerController {
  constructor(
    private readonly studentsMockExamAnswerService: StudentsMockExamAnswerService,
  ) {}

  @ApiOperation({ summary: 'Cadastrar resposta de questão para estudante' })
  @ApiResponse({
    status: 200,
    description: 'Resposta criada com sucesso',
    type: StudentMockExamAnswerResponseDto,
  })
  @Put(':id/answers')
  @ApiBody({ type: CreateStudentMockExamAnswerDto })
  create(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
    @Body() dto: CreateStudentMockExamAnswerDto,
  ): Promise<StudentMockExamAnswerResponseDto> {
    return this.studentsMockExamAnswerService.createOrUpdate(
      dto,
      params.id,
      user._id,
    );
  }

  @ApiOperation({ summary: 'Obter listagem de respostas do estudante' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de respostas do estudante retornada com sucesso',
    type: [StudentMockExamAnswerResponseDto],
  })
  @Get(':id/answers')
  findAll(
    @UserRequest() user: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<StudentMockExamAnswerResponseDto[]> {
    return this.studentsMockExamAnswerService.findAll(params.id, user._id);
  }
}
