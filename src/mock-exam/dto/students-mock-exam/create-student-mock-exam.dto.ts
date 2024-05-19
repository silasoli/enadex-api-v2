import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateStudentMockExamDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o simulado.' })
  @IsMongoId({ message: 'O Simulado deve ser valido. ' })
  mock_exam_id: string;
}
