import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AnswersQuestionsService } from '../services/answers-questions.service';
import { CreateAnswersQuestionsDto } from '../dto/create-answers-question.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../common/dto/user-request.dto';
import { AnswersQuestionsResponseDto } from '../dto/answers-questions-response.dto';
import { IDQueryDTO } from '../../common/dto/id-query.dto';

@ApiBearerAuth()
@ApiTags('Me Answers Questions')
@Controller('me/answers-questions')
@UseGuards(AuthUserJwtGuard)
export class AnswersQuestionsController {
  constructor(
    private readonly answersQuestionsService: AnswersQuestionsService,
  ) {}

  @ApiOperation({ summary: 'Cadastrar resposta de questão para estudante' })
  @ApiResponse({
    status: 201,
    description: 'Resposta criada com sucesso',
    type: AnswersQuestionsResponseDto,
  })
  @Post()
  @ApiBody({ type: CreateAnswersQuestionsDto })
  create(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: CreateAnswersQuestionsDto,
  ): Promise<AnswersQuestionsResponseDto> {
    return this.answersQuestionsService.create(dto, user._id);
  }

  @ApiOperation({ summary: 'Obter listagem de respostas do estudante' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de respostas do estudante retornada com sucesso',
    type: [AnswersQuestionsResponseDto],
  })
  @Get()
  findAll(
    @UserRequest() user: UserRequestDTO,
  ): Promise<AnswersQuestionsResponseDto[]> {
    return this.answersQuestionsService.findAll(user._id);
  }

  @ApiOperation({ summary: 'Obter resposta de um estudante para uma questão' })
  @ApiResponse({
    status: 200,
    description: 'Resposta retornada com sucesso',
    type: AnswersQuestionsResponseDto,
  })
  @Get('/questions/:id')
  findOne(@UserRequest() user: UserRequestDTO, @Param() params: IDQueryDTO) {
    return this.answersQuestionsService.findByQuestion(params.id, user._id);
  }
}
