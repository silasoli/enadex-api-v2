import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student, StudentDocument } from '../schemas/student.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { StudentResponseDto } from '../dto/student-response.dto';
import { STUDENTS_ERRORS } from '../constants/students-errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private studentsModel: Model<StudentDocument>,
  ) {}

  public async findByEmail(email: string, active: boolean): Promise<Student> {
    const filter: FilterQuery<Student> = { email: email.toLowerCase() };

    if (active) filter.active = active;

    return this.studentsModel.findOne(filter, ['+password']);
  }

  private async transformBody(dto: CreateStudentDto | UpdateStudentDto) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
  }

  public async create(dto: CreateStudentDto): Promise<StudentResponseDto> {
    await this.transformBody(dto);

    const created = await this.studentsModel.create(dto);

    return new StudentResponseDto(created);
  }

  public async findAll(): Promise<StudentResponseDto[]> {
    const managers = await this.studentsModel.find();

    return managers.map((manager) => new StudentResponseDto(manager));
  }

  private async findStudentByID(_id: string): Promise<Student> {
    const manager = await this.studentsModel.findById(_id);

    if (!manager) throw STUDENTS_ERRORS.NOT_FOUND;

    return manager;
  }

  public async findOne(_id: string): Promise<StudentResponseDto> {
    const manager = await this.findStudentByID(_id);

    return new StudentResponseDto(manager);
  }

  public async update(
    _id: string,
    dto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    await this.findStudentByID(_id);

    const rawData = { ...dto };

    await this.transformBody(rawData);

    await this.studentsModel.updateOne({ _id }, rawData);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findStudentByID(_id);
    await this.studentsModel.updateOne({ _id }, { active: false });
  }
}
