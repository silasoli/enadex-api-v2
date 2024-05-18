import { ApiProperty } from '@nestjs/swagger';
import { MockExam } from '../schemas/mock-exam.entity';
import { CourseResponseDto } from '../../question/dto/question-response.dto';

export class MockExamResponseDto {
  constructor(mockExam: MockExam) {
    const {
      _id,
      name,
      course_id,
      duration,
      available,
      finished,
      finishedAt,
      createdAt,
      updatedAt,
    } = mockExam;

    return {
      _id: String(_id),
      name,
      course_id: { _id: String(course_id._id), name: course_id.name },
      duration,
      available,
      finished,
      finishedAt,
      createdAt,
      updatedAt,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({
    required: true,
    type: CourseResponseDto,
    example: { _id: 'string', name: 'string' },
  })
  course_id: CourseResponseDto;

  @ApiProperty({ required: true })
  available: boolean;

  @ApiProperty({ required: true })
  duration: number;

  @ApiProperty({ required: true })
  finished: boolean;

  @ApiProperty({ required: true })
  finishedAt: Date | null;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updatedAt: Date;
}
