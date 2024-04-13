import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import { StudentResponseDto } from '../dto/student-response.dto';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { StudentsRegisterService } from '../services/students-register.service';

@ApiBearerAuth()
@ApiTags('Students')
@Controller('students-register')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class StudentsRegisterController {
  constructor(
    private readonly studentsRegisterService: StudentsRegisterService,
  ) {}

  @ApiOperation({ summary: 'Obter listagem de solicitações de contas' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de solicitações de contas retornada com sucesso',
    type: StudentResponseDto,
  })
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Get()
  findAll(): Promise<StudentResponseDto[]> {
    return this.studentsRegisterService.findAllStudentRegister();
  }

  @ApiOperation({ summary: 'Aprovar solicitação de conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Solicitação de conta do usuário aprovada com sucesso',
  })
  @HttpCode(204)
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Post(':id/approve')
  approveRequest(@Param() params: IDQueryDTO): Promise<void> {
    return this.studentsRegisterService.approveRequest(params.id);
  }


  @ApiOperation({ summary: 'Cancelar solicitação de conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Cancelamento de conta do usuário realizado com sucesso',
  })
  @HttpCode(204)
  @Role([ManagersRoleEnum.COORDINATORS, ManagersRoleEnum.TEACHERS])
  @Delete(':id/cancel')
  deleteRequest(@Param() params: IDQueryDTO): Promise<void> {
    return this.studentsRegisterService.deleteRequest(params.id);
  }
}
