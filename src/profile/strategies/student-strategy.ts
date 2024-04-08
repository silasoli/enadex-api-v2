import { Injectable } from '@nestjs/common';
import { ProfileStrategy } from './profile-strategy.interface';
import { StudentsService } from '../../students/services/students.service';
import { StudentResponseDto } from '../../students/dto/student-response.dto';
import { UpdateStudentDto } from '../../students/dto/update-student.dto';

@Injectable()
export class StudentStrategy implements ProfileStrategy {
  constructor(private readonly studentsService: StudentsService) {}

  public async findOneProfile(_id: string): Promise<StudentResponseDto> {
    return this.studentsService.findOne(_id);
  }

  async updateOneProfile(
    _id: string,
    dto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(_id, dto);
  }

  public async disableOneProfile(_id: string): Promise<void> {
    return this.studentsService.remove(_id);
  }
}
