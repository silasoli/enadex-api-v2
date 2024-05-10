import { Injectable } from '@nestjs/common';
import { Student, StudentDocument } from '../schemas/student.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentResponseDto } from '../dto/student-response.dto';
import { StudentsService } from './students.service';
import { STUDENTS_ERRORS } from '../constants/students-errors';
import { CreateStudentDto } from '../dto/create-student.dto';

@Injectable()
export class StudentsRegisterService {
  constructor(
    @InjectModel(Student.name)
    private studentsModel: Model<StudentDocument>,
    private studentsService: StudentsService,
  ) {}

  public async createStudentRegister(
    dto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    await this.studentsService.validatingManagersEmail(dto.email);

    await this.studentsService.transformBody(dto);

    const created = await this.studentsModel.create({
      ...dto,
      active: false,
      approved: false,
    });

    return new StudentResponseDto(created);
  }

  public async findAllStudentRegister(): Promise<StudentResponseDto[]> {
    const students = await this.studentsModel
      .find({ approved: false })
      .populate({ path: 'course_id' });

    return students.map((student) => new StudentResponseDto(student));
  }

  public async approveRequest(_id: string): Promise<void> {
    const student = await this.studentsService.findStudentByID(_id);

    if (student.approved) throw STUDENTS_ERRORS.NOT_FOUND_REQUEST;

    await this.studentsModel.updateOne(
      { _id },
      { active: true, approved: true },
    );
  }

  public async deleteRequest(_id: string): Promise<void> {
    const student = await this.studentsService.findStudentByID(_id);

    if (student.approved) throw STUDENTS_ERRORS.NOT_FOUND_REQUEST;

    await this.studentsModel.deleteOne({ _id });
  }
}
