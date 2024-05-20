import { ApiProperty } from '@nestjs/swagger';
import { Manager } from '../schemas/manager.entity';
import { CourseResponseDto } from '../../question/dto/question-response.dto';

export class ManagerResponseDto {
  constructor(manager: Manager) {
    const { _id, name, email, courses_id, role, active } = manager;

    return { _id: String(_id), name, email, courses_id, role, active };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  courses_id: CourseResponseDto[];

  @ApiProperty({ required: true })
  role: string;

  @ApiProperty({ required: true })
  active: boolean;
}
