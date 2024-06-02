import { Injectable } from '@nestjs/common';
import { CreateMockExamDto } from '../../dto/mock-exam/create-mock-exam.dto';
import { UpdateMockExamDto } from '../../dto/mock-exam/update-mock-exam.dto';
import { MockExam, MockExamDocument } from '../../schemas/mock-exam.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MOCK_EXAM_ERRORS } from '../../constants/mock-exam-errors';
import { MockExamResponseDto } from '../../dto/mock-exam/mock-exam-response.dto';

@Injectable()
export class MockExamService {
  constructor(
    @InjectModel(MockExam.name)
    private mockExamModel: Model<MockExamDocument>,
  ) {}

  private async checkIfCanChange(mockExam: MockExam): Promise<void> {
    if (mockExam.finished || mockExam.finishedAt)
      throw MOCK_EXAM_ERRORS.FINISHED_MOCK_EXAM;

    if (mockExam.available) throw MOCK_EXAM_ERRORS.AVAILABLE_MOCK_EXAM;
  }

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

  public async findAllAvailable(): Promise<MockExamResponseDto[]> {
    const mockExams = await this.mockExamModel
      .find({ available: true, finished: false, finishedAt: null  })
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
    const mockExam = await this.findMockExamByID(_id);

    await this.checkIfCanChange(mockExam);

    await this.mockExamModel.updateOne({ _id }, dto);

    return this.findOne(_id);
  }

  public async makeAvailable(_id: string): Promise<void> {
    const mockExam = await this.findMockExamByID(_id);

    //verificar se existe questao

    if (mockExam.available) throw MOCK_EXAM_ERRORS.IS_AVAILABLE;

    await this.mockExamModel.updateOne({ _id }, { available: true });
  }

  public async finishMockExam(_id: string): Promise<void> {
    const mockExam = await this.findMockExamByID(_id);

    if (mockExam.finished || mockExam.finishedAt)
      throw MOCK_EXAM_ERRORS.IS_FINISHED;

    await this.mockExamModel.updateOne(
      { _id },
      { finished: true, updatedAt: new Date() },
    );
  }

  public async remove(_id: string): Promise<void> {
    await this.mockExamModel.deleteOne({ _id });
  }
}
