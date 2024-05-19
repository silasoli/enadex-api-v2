import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MockExamService } from '../services/mock-exam.service';
import { CreateMockExamDto } from '../dto/mock-exam/create-mock-exam.dto';
import { UpdateMockExamDto } from '../dto/mock-exam/update-mock-exam.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import { Role } from '../../roles/decorators/roles.decorator';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { MockExamResponseDto } from '../dto/mock-exam/mock-exam-response.dto';

@ApiBearerAuth()
@ApiTags('Mock Exams')
@Controller('mock-exams')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class MockExamController {
  constructor(private readonly mockExamService: MockExamService) {}

  @ApiOperation({ summary: 'Criar simulado' })
  @ApiResponse({
    status: 201,
    description: 'Simulado criado com sucesso',
    type: MockExamResponseDto,
  })
  @ApiBody({ type: CreateMockExamDto })
  @Post()
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  public create(
    @Body() createMockExamDto: CreateMockExamDto,
  ): Promise<MockExamResponseDto> {
    return this.mockExamService.create(createMockExamDto);
  }

  @ApiOperation({ summary: 'Obter listagem de simulados' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de simulados retornada com sucesso',
    type: [MockExamResponseDto],
  })
  @Get()
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  public findAll(): Promise<MockExamResponseDto[]> {
    return this.mockExamService.findAll();
  }

  @ApiOperation({ summary: 'Obter simulado' })
  @ApiResponse({
    status: 200,
    description: 'Simulado retornado com sucesso',
    type: MockExamResponseDto,
  })
  @Get(':id')
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  public findOne(@Param() params: IDQueryDTO): Promise<MockExamResponseDto> {
    return this.mockExamService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar simulado' })
  @ApiResponse({
    status: 200,
    description: 'Edição do simulado realizada com sucesso',
    type: MockExamResponseDto,
  })
  @ApiBody({ type: UpdateMockExamDto })
  @Patch(':id')
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  public update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateMockExamDto,
  ): Promise<MockExamResponseDto> {
    return this.mockExamService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Excluir simulado' })
  @ApiResponse({
    status: 204,
    description: 'Simulado excluido com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  public remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.mockExamService.remove(params.id);
  }
}
