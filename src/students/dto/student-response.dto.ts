import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../schemas/student.entity';
import { CourseResponseDto } from '../../question/dto/question-response.dto';

export class StudentResponseDto {
  constructor(student: Student) {
    const {
      _id,
      name,
      email,
      registration,
      semester,
      course_id,
      unity,
      active,
    } = student;

    return {
      _id: String(_id),
      name,
      email,
      registration,
      semester,
      course_id,
      unity,
      active,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  registration: string;

  @ApiProperty({ required: true })
  semester: string;

  @ApiProperty({ required: true, type: CourseResponseDto })
  course_id: CourseResponseDto;

  @ApiProperty({ required: true })
  unity: string;

  @ApiProperty({ required: true })
  active: boolean;
}
