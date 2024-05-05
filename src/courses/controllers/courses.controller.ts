import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoursesService } from '../services/courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseResponseDto } from '../dto/course-response.dto';
import { ManagersRoleEnum } from '../../managers/schemas/manager.entity';
import { Role } from '../../roles/decorators/roles.decorator';

@ApiTags('Courses')
@Controller('courses')
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

  @ApiOperation({ summary: 'Obter listagem de cursos dos usuários' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de cursos retornada com sucesso',
    type: CourseResponseDto,
  })
  @Role([ManagersRoleEnum.COORDINATORS])
  @Get()
  findAll(): Promise<CourseResponseDto[]> {
    return this.coursesService.findAll();
  }
}
