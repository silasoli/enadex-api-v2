import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from '../services/courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CourseResponseDto } from '../dto/course-response.dto';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { Role } from '../../roles/decorators/roles.decorator';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';

@ApiBearerAuth()
@ApiTags('Courses')
@Controller('courses')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Criar curso' })
  @ApiResponse({
    status: 200,
    description: 'Curso criado com sucesso',
    type: CourseResponseDto,
  })
  @ApiBody({ type: CreateCourseDto })
  @Role([ManagersRoleEnum.COORDINATORS])
  @Post()
  create(@Body() dto: CreateCourseDto): Promise<CourseResponseDto> {
    return this.coursesService.create(dto);
  }

  @ApiOperation({ summary: 'Obter listagem de cursos' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de cursos retornada com sucesso',
    type: CourseResponseDto,
  })
  @Get()
  findAll(): Promise<CourseResponseDto[]> {
    return this.coursesService.findAll();
  }

  @ApiOperation({ summary: 'Obter curso' })
  @ApiResponse({
    status: 200,
    description: 'Curso retornado com sucesso',
    type: CourseResponseDto,
  })
  @Role([ManagersRoleEnum.COORDINATORS])
  @Get(':id')
  findOne(@Param() params: IDQueryDTO): Promise<CourseResponseDto> {
    return this.coursesService.findOne(params.id);
  }
}
