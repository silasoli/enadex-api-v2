import { PartialType } from '@nestjs/swagger';
import { CreateMockExamDto } from './create-mock-exam.dto';

export class UpdateMockExamDto extends PartialType(CreateMockExamDto) {}
