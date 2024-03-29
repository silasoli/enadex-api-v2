import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { UpdateManagerDto } from '../dto/update-manager.dto';
import { Manager, ManagerDocument } from '../schemas/manager.entity';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MANAGERS_ERRORS } from '../constants/managers-errors';
import * as bcrypt from 'bcrypt';
import { ManagerResponseDto } from '../dto/manager-response.dto';
import { StudentsService } from 'src/students/services/students.service';

@Injectable()
export class ManagersService {
  constructor(
    @InjectModel(Manager.name)
    private managerModel: Model<ManagerDocument>,
    @Inject(forwardRef(() => StudentsService))
    private studentsService: StudentsService
  ) {}

  public async findByEmail(email: string, active: boolean): Promise<Manager> {
    const filter: FilterQuery<Manager> = { email: email.toLowerCase() };

    if (active) filter.active = active;

    return this.managerModel.findOne(filter, ['+password']);
  }

  private async transformBody(dto: CreateManagerDto | UpdateManagerDto) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
  }

  private async validatingStudentsEmail(email: string) {
    const student = await this.studentsService.findByEmail(email, false);
    if (student) throw MANAGERS_ERRORS.DUPLICATE_EMAIL;
  }

  public async create(dto: CreateManagerDto): Promise<ManagerResponseDto> {
    await this.validatingStudentsEmail(dto.email)

    await this.transformBody(dto);

    const created = await this.managerModel.create(dto);

    return new ManagerResponseDto(created);
  }

  public async findAll(): Promise<ManagerResponseDto[]> {
    const managers = await this.managerModel.find();

    return managers.map((manager) => new ManagerResponseDto(manager));
  }

  private async findManagerByID(_id: string): Promise<Manager> {
    const manager = await this.managerModel.findById(_id);

    if (!manager) throw MANAGERS_ERRORS.NOT_FOUND;

    return manager;
  }

  public async findOne(_id: string): Promise<ManagerResponseDto> {
    const manager = await this.findManagerByID(_id);

    return new ManagerResponseDto(manager);
  }

  public async update(
    _id: string,
    dto: UpdateManagerDto,
  ): Promise<ManagerResponseDto> {
    await this.findManagerByID(_id);

    if (dto.email) await this.validatingStudentsEmail(dto.email);

    const rawData = { ...dto };

    await this.transformBody(rawData);

    await this.managerModel.updateOne({ _id }, rawData);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findManagerByID(_id);
    await this.managerModel.updateOne({ _id }, { active: false });
  }
}
