import { ApiProperty } from '@nestjs/swagger';
import { StudentsMockExam } from '../../schemas/students-mock-exam.entity';

export class StudentMockExamResponseDto {
  constructor(studentsMockExam: StudentsMockExam) {
    const {
      _id,
      mock_exam_id,
      student_id,
      finished,
      finishedAt,
      createdAt,
      updatedAt,
    } = studentsMockExam;

    return {
      _id: String(_id),
      mock_exam_id,
      student_id: String(student_id),
      finished,
      finishedAt,
      createdAt,
      updatedAt,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  mock_exam_id: any;

  @ApiProperty({ required: true })
  student_id: string;

  @ApiProperty({ required: true })
  finished: boolean;

  @ApiProperty({ required: true })
  finishedAt: Date | null;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;
}
