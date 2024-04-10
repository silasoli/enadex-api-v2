import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';

@ApiBearerAuth()
@ApiTags('Students')
@Controller('students')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Criar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta de usuário criada com sucesso',
    type: StudentResponseDto,
  })
  @ApiBody({ type: CreateStudentDto })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Post()
  create(
    @Body() CreateStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.create(CreateStudentDto);
  }

  @ApiOperation({ summary: 'Obter listagem de contas dos usuários' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de contas dos usuários retornada com sucesso',
    type: StudentResponseDto,
  })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Get()
  findAll(): Promise<StudentResponseDto[]> {
    return this.studentsService.findAll();
  }

  @ApiOperation({ summary: 'Obter conta do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta do usuário retornada com sucesso',
    type: StudentResponseDto,
  })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Get(':id')
  findOne(@Param() params: IDQueryDTO): Promise<StudentResponseDto> {
    return this.studentsService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Editar da conta do usuário realizada com sucesso',
    type: StudentResponseDto,
  })
  @ApiBody({ type: UpdateStudentDto })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Patch(':id')
  update(
    @Param() params: IDQueryDTO,
    @Body() UpdateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(params.id, UpdateStudentDto);
  }

  @ApiOperation({ summary: 'Ativar conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta do usuário ativada com sucesso',
  })
  @HttpCode(204)
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Post(':id/activate')
  activateStudent(@Param() params: IDQueryDTO): Promise<void> {
    return this.studentsService.activeOrDeactive(params.id, true);
  }

  @ApiOperation({ summary: 'Desativar conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta do usuário desativada com sucesso',
  })
  @HttpCode(204)
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Post(':id/deactivate')
  deactivateStudent(@Param() params: IDQueryDTO): Promise<void> {
    return this.studentsService.activeOrDeactive(params.id, false);
  }
}
