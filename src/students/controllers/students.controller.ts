import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IDQueryDTO } from 'src/common/dto/id-query.dto';
import { StudentResponseDto } from '../dto/student-response.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Criar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta de usuário criada com sucesso',
    type: StudentResponseDto,
  })
  @ApiBody({ type: CreateStudentDto })
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
  @Patch(':id')
  update(
    @Param() params: IDQueryDTO,
    @Body() UpdateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(params.id, UpdateStudentDto);
  }

  @ApiOperation({ summary: 'Desativar conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta do usuário desativada com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.studentsService.remove(params.id);
  }
}
