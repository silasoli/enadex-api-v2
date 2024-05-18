import { Injectable } from '@nestjs/common';
import { CreateMockExamDto } from '../dto/create-mock-exam.dto';
import { UpdateMockExamDto } from '../dto/update-mock-exam.dto';
import { MockExam, MockExamDocument } from '../schemas/mock-exam.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MOCK_EXAM_ERRORS } from '../constants/questions-errors';
import { MockExamResponseDto } from '../dto/mock-exam-response.dto';

@Injectable()
export class MockExamService {
  constructor(
    @InjectModel(MockExam.name)
    private mockExamModel: Model<MockExamDocument>,
  ) {}

  public async create(dto: CreateMockExamDto): Promise<MockExamResponseDto> {
    const created = await this.mockExamModel.create({ ...dto });

    return new MockExamResponseDto(created);
  }

  public async findAll(): Promise<MockExamResponseDto[]> {
    const mockExams = await this.mockExamModel
      .find()
      .populate({ path: 'course_id' });

    return mockExams.map((item) => new MockExamResponseDto(item));
  }

  public async findMockExamByID(_id: string): Promise<MockExam> {
    const mock = await this.mockExamModel
      .findById(_id)
      .populate({ path: 'course_id' });

    if (!mock) throw MOCK_EXAM_ERRORS.NOT_FOUND;

    return mock;
  }

  public async findOne(_id: string): Promise<MockExamResponseDto> {
    const mock = await this.findMockExamByID(_id);

    return new MockExamResponseDto(mock);
  }

  public async update(
    _id: string,
    dto: UpdateMockExamDto,
  ): Promise<MockExamResponseDto> {
    await this.findMockExamByID(_id);

    await this.mockExamModel.updateOne({ _id }, dto);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.mockExamModel.deleteOne({ _id });
  }
}
