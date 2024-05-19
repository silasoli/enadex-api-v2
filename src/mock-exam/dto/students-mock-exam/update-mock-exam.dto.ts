import { PartialType } from '@nestjs/swagger';
import { CreateStudentMockExamDto } from './create-student-mock-exam.dto';

export class UpdateStudentMockExamDto extends PartialType(
  CreateStudentMockExamDto,
) {}
