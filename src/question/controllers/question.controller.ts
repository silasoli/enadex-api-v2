import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  Param,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { QuestionResponseDto } from '../dto/question-response.dto';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { Role } from '../../roles/decorators/roles.decorator';
import { QuestionQueryDto } from '../dto/questions-query.dto';
import { FilterResponseDto } from '../dto/filter-response.dto';

@ApiBearerAuth()
@ApiTags('Questions')
@Controller('questions')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: 'Create a question' })
  @ApiCreatedResponse({
    status: 201,
    type: QuestionResponseDto,
    description: 'Question create returned successfully',
  })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Post()
  create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @ApiOperation({ summary: 'List filters' })
  @ApiOkResponse({
    type: [FilterResponseDto],
  })
  @Get('filters')
  async getFilters(): Promise<FilterResponseDto[]> {
    return this.questionService.getFilters();
  }

  @ApiOperation({ summary: 'List questions' })
  @ApiOkResponse({
    type: QuestionResponseDto,
    description: 'Questions listing returned successfully',
  })
  @Get()
  async findAll(
    @Query() dto: QuestionQueryDto,
  ): Promise<QuestionResponseDto[]> {
    return this.questionService.findAll(dto);
  }

  @ApiOperation({ summary: 'Find question by ID' })
  @ApiOkResponse({
    type: QuestionResponseDto,
    description: 'Question returned successfully',
  })
  @Get(':id')
  findOne(@Param() params: IDQueryDTO): Promise<QuestionResponseDto> {
    return this.questionService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Update a question' })
  @ApiOkResponse({
    type: QuestionResponseDto,
    description: 'Question update returned successfully',
  })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Patch(':id')
  update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    return this.questionService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Delete  Question' })
  @ApiResponse({
    status: 204,
    description: 'Question deleted with sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  public remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.questionService.removeQuestionAnswers(params.id);
  }
}
