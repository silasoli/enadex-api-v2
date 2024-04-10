import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { Student, StudentDocument } from '../schemas/student.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { StudentResponseDto } from '../dto/student-response.dto';
import { STUDENTS_ERRORS } from '../constants/students-errors';
import * as bcrypt from 'bcrypt';
import { ManagersService } from '../../managers/services/managers.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private studentsModel: Model<StudentDocument>,
    @Inject(forwardRef(() => ManagersService))
    private managersService: ManagersService,
  ) {}

  public async findByEmail(email: string, active: boolean): Promise<Student> {
    const filter: FilterQuery<Student> = { email: email.toLowerCase() };

    if (active) filter.active = active;

    return this.studentsModel.findOne(filter, ['+password']);
  }

  private async transformBody(dto: CreateStudentDto | UpdateStudentDto) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
  }

  private async validatingManagersEmail(email: string) {
    const manager = await this.managersService.findByEmail(email, false);
    if (manager) throw STUDENTS_ERRORS.DUPLICATE_EMAIL;
  }

  public async create(dto: CreateStudentDto): Promise<StudentResponseDto> {
    await this.validatingManagersEmail(dto.email);

    await this.transformBody(dto);

    const created = await this.studentsModel.create(dto);

    return new StudentResponseDto(created);
  }

  public async findAll(): Promise<StudentResponseDto[]> {
    const students = await this.studentsModel.find();

    return students.map((student) => new StudentResponseDto(student));
  }

  private async findStudentByID(_id: string): Promise<Student> {
    const student = await this.studentsModel.findById(_id);

    if (!student) throw STUDENTS_ERRORS.NOT_FOUND;

    return student;
  }

  public async findOne(_id: string): Promise<StudentResponseDto> {
    const student = await this.findStudentByID(_id);

    return new StudentResponseDto(student);
  }

  public async update(
    _id: string,
    dto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    await this.findStudentByID(_id);

    if (dto.email) await this.validatingManagersEmail(dto.email);

    const rawData = { ...dto };

    await this.transformBody(rawData);

    await this.studentsModel.updateOne({ _id }, rawData);

    return this.findOne(_id);
  }

  public async activeOrDeactive(_id: string, active: boolean): Promise<void> {
    await this.findStudentByID(_id);
    await this.studentsModel.updateOne({ _id }, { active });
  }
}
