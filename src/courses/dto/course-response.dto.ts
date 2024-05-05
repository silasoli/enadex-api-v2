import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../schema/course.entity';

export class CourseResponseDto {
  constructor(course: Course) {
    const { _id, name, slug, createdAt } = course;

    return { _id: String(_id), name, slug, createdAt };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  slug: string;

  @ApiProperty({ required: true })
  createdAt: Date;
}
