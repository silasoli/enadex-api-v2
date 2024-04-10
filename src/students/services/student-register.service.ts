import { Injectable } from '@nestjs/common';
import { StudentRegisterDto } from '../dto/student-register.dto';
import { Student, StudentDocument } from '../schemas/student.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentResponseDto } from '../dto/student-response.dto';
import { StudentsService } from './students.service';

@Injectable()
export class StudentRegisterService {
  constructor(
    @InjectModel(Student.name)
    private studentsModel: Model<StudentDocument>,
    private studentsService: StudentsService,
  ) {}

  public async createStudentRegister(
    dto: StudentRegisterDto,
  ): Promise<StudentResponseDto> {
    await this.studentsService.validatingManagersEmail(dto.email);

    await this.studentsService.transformBody(dto);

    const created = await this.studentsModel.create(dto);

    return new StudentResponseDto(created);
  }

  public async findAllStudentRegister(): Promise<StudentResponseDto[]> {
    const students = await this.studentsModel.find({ approved: false });

    return students.map((student) => new StudentResponseDto(student));
  }
}
