import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../schemas/student.entity';

export class StudentResponseDto {
  constructor(student: Student) {
    const { _id, name, email, registration, semester, unity, active } = student;

    return {
      _id: String(_id),
      name,
      email,
      registration,
      semester,
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

  @ApiProperty({ required: true })
  unity: string;

  @ApiProperty({ required: true })
  active: boolean;
}
