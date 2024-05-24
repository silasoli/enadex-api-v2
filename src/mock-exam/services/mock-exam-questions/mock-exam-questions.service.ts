import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  MockExamQuestion,
  MockExamQuestionDocument,
} from '../../schemas/mock-exam-question.entity';
import { MOCK_EXAM_QUESTIONS_ERRORS } from '../../constants/mock-exam-questions-errors';
import {
  CreateMockExamQuestionDto,
  OptionPartDto,
} from '../../dto/mock-exam-questions/create-mock-exam-question.dto';
import {
  UpdateMockExamQuestionDto,
  UpdateOptionPartDto,
} from '../../dto/mock-exam-questions/update-mock-exam-question.dto';
import { MockExamQuestionResponseDto } from '../../dto/mock-exam-questions/mock-exam-question-response.dto';
import { MockExamQuestionQueryDto } from '../../dto/mock-exam-questions/mock-exam-questions-query.dto';
import { MockExamService } from '../mock-exam/mock-exam.service';

@Injectable()
export class MockExamQuestionsService {
  constructor(
    @InjectModel(MockExamQuestion.name)
    private mockExamQuestionsModel: Model<MockExamQuestionDocument>,
    private readonly mockExamService: MockExamService,

  ) {}

  private async verifyMockExamExits(mock_exam_id: string): Promise<void> {
    await this.mockExamService.findMockExamByID(mock_exam_id);
  }

  private checkIfHaveCorrectOption(
    options: OptionPartDto[] | UpdateOptionPartDto[],
  ): void {
    const trueCount = options.filter((option) => option.correctOption).length;

    if (trueCount < 1) throw MOCK_EXAM_QUESTIONS_ERRORS.HAVE_CORRECT_OPTION;

    if (trueCount > 1) throw MOCK_EXAM_QUESTIONS_ERRORS.MULTIPLE_CORRECT_OPTION;
  }

  public async create(
    mock_exam_id: string,
    dto: CreateMockExamQuestionDto,
  ): Promise<MockExamQuestionResponseDto> {
    await this.verifyMockExamExits(mock_exam_id);

    this.checkIfHaveCorrectOption(dto.options);

    const created = await this.mockExamQuestionsModel.create(dto);

    return new MockExamQuestionResponseDto(created);
  }

  public async findAll(
    mock_exam_id: string,
    searchParams: MockExamQuestionQueryDto,
  ): Promise<MockExamQuestionResponseDto[]> {
    const { searchText } = searchParams;

    await this.verifyMockExamExits(mock_exam_id);

    const filter: FilterQuery<MockExamQuestion> = { mock_exam_id };

    if (searchText) {
      filter.statements = {
        $elemMatch: { description: { $regex: searchText, $options: 'i' } },
      };
    }

    const data = await this.mockExamQuestionsModel
      .find(filter)
      .populate({ path: 'course_id' });

    return data.map((item) => new MockExamQuestionResponseDto(item));
  }

  public async findQuestionByID(_id: string): Promise<any> {
    const question = await this.mockExamQuestionsModel
      .findById(_id)
      .populate({ path: 'course_id' });

    if (!question) throw MOCK_EXAM_QUESTIONS_ERRORS.NOT_FOUND;

    return question;
  }

  public async findOne(_id: string): Promise<MockExamQuestionResponseDto> {
    const question = await this.findQuestionByID(_id);

    return new MockExamQuestionResponseDto(question);
  }

  public async update(
    _id: string,
    dto: UpdateMockExamQuestionDto,
  ): Promise<MockExamQuestionResponseDto> {
    await this.findQuestionByID(_id);

    if (dto?.options) {
      // dto.options = this.validateOptionsUpdate(entity.options, dto.options);
      this.checkIfHaveCorrectOption(dto.options);
    }

    await this.mockExamQuestionsModel.updateOne({ _id }, dto);

    return this.findOne(_id);
  }
}
