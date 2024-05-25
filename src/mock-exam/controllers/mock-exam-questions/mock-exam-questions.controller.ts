import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../../roles/guards/role.guard';
import { MockExamQuestionsService } from '../../services/mock-exam-questions/mock-exam-questions.service';
import { CreateMockExamQuestionDto } from '../../dto/mock-exam-questions/create-mock-exam-question.dto';
import { MockExamQuestionResponseDto } from '../../dto/mock-exam-questions/mock-exam-question-response.dto';
import { IDQueryDTO } from '../../../common/dto/id-query.dto';
import { MockExamQuestionParamDto } from '../../dto/mock-exam-questions/mock-exam-questions-param.dto';
import { UpdateMockExamQuestionDto } from '../../dto/mock-exam-questions/update-mock-exam-question.dto';
import { MockExamQuestionQueryDto } from '../../dto/mock-exam-questions/mock-exam-questions-query.dto';
import { Role } from '../../../roles/decorators/roles.decorator';
import { ManagersRoleEnum } from '../../../managers/schemas/manager.entity';

@ApiBearerAuth()
@ApiTags('Mock Exams')
@Controller('mock-exams')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class MockExamQuestionsController {
  constructor(private readonly service: MockExamQuestionsService) {}

  @ApiOperation({ summary: 'Criar questão para um simulado.' })
  @ApiCreatedResponse({
    status: 201,
    type: CreateMockExamQuestionDto,
    description: 'Questão criada com sucesso.',
  })
  @ApiBody({ type: CreateMockExamQuestionDto })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Post(':id/questions')
  create(
    @Param() params: IDQueryDTO,
    @Body() dto: CreateMockExamQuestionDto,
  ): Promise<MockExamQuestionResponseDto> {
    return this.service.create(params.id, dto);
  }

  @ApiOperation({ summary: 'Obter listagem de questões de um simulado.' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de questões do simulado retornada com sucesso.',
    type: [MockExamQuestionResponseDto],
  })
  @Get(':id/questions')
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  findAll(
    @Param() params: IDQueryDTO,
    @Query() query: MockExamQuestionQueryDto,
  ): Promise<MockExamQuestionResponseDto[]> {
    return this.service.findAll(params.id, query);
  }

  @ApiOperation({ summary: 'Obter uma questão de um simulado.' })
  @ApiResponse({
    status: 200,
    description: 'Questão retornada com sucesso.',
    type: MockExamQuestionResponseDto,
  })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Get(':id/questions/:question_id')
  findOne(
    @Param() params: MockExamQuestionParamDto,
  ): Promise<MockExamQuestionResponseDto> {
    return this.service.findOne(params.question_id, params.id);
  }

  @ApiOperation({ summary: 'Atualizar uma questão de um simulado.' })
  @ApiResponse({
    status: 200,
    description: 'Questão atualizada com sucesso.',
    type: UpdateMockExamQuestionDto,
  })
  @ApiBody({ type: CreateMockExamQuestionDto })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Get(':id/questions/:question_id')
  @Patch(':id/questions/:question_id')
  update(
    @Param() params: MockExamQuestionParamDto,
    @Body() dto: UpdateMockExamQuestionDto,
  ) {
    return this.service.update(params.question_id, params.id, dto);
  }

  @ApiOperation({ summary: 'Excluir uma questão de um simulado.' })
  @ApiResponse({
    status: 204,
    description: 'Questão de simulado excluida com sucesso.',
  })
  @HttpCode(204)
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Delete(':id/questions/:question_id')
  remove(@Param() params: MockExamQuestionParamDto): Promise<void> {
    return this.service.remove(params.question_id, params.id);
  }
}
