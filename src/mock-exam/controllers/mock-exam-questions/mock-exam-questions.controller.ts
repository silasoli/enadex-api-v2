import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // HttpCode,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  // ApiBody,
  // ApiOperation,
  // ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../../roles/guards/role.guard';
import { MockExamQuestionsService } from '../../services/mock-exam-questions/mock-exam-questions.service';
import { CreateMockExamQuestionDto } from '../../dto/mock-exam-questions/create-mock-exam-question.dto';
import { MockExamQuestionResponseDto } from '../../dto/mock-exam-questions/mock-exam-question-response.dto';
import { IDQueryDTO } from '../../../common/dto/id-query.dto';
// import { IDQueryDTO } from '../../../common/dto/id-query.dto';
// import { Role } from '../../../roles/decorators/roles.decorator';
// import { ManagersRoleEnum } from '../../../managers/schemas/manager.entity';

@ApiBearerAuth()
@ApiTags('Mock Exams')
@Controller('mock-exams')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class MockExamQuestionsController {
  constructor(private readonly service: MockExamQuestionsService) {}

  // @ApiOperation({ summary: 'Create a question' })
  // @ApiCreatedResponse({
  //   status: 201,
  //   type: QuestionResponseDto,
  //   description: 'Question create returned successfully',
  // })
  // @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Post(':id/questions')
  create(
    @Param() params: IDQueryDTO,
    @Body() dto: CreateMockExamQuestionDto,
  ): Promise<MockExamQuestionResponseDto> {
    return this.service.create(params.id, dto);
  }

  @Get(':id/questions')
  findAll(@Param() params: IDQueryDTO, @Query() query: any) {
    return this.service.findAll(params.id, query);
  }
}
