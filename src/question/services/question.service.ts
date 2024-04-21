import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { Question, QuestionDocument } from '../schema/question.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionResponseDto } from '../dto/question-response.dto';
import { QUESTIONS_ERRORS } from '../constants/questions-errors';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
  ) {}

  public async create(dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    const created = await this.questionModel.create(dto);

    return new QuestionResponseDto(created);
  }

  public async findAll(): Promise<QuestionResponseDto[]> {
    const data = await this.questionModel.find();

    return data.map((item) => new QuestionResponseDto(item));
  }

  public async findQuestionByID(_id: string): Promise<Question> {
    const question = await this.questionModel.findById(_id);

    if (!question) throw QUESTIONS_ERRORS.NOT_FOUND;

    return question;
  }

  public async findOne(_id: string): Promise<QuestionResponseDto> {
    const question = await this.findQuestionByID(_id);

    return new QuestionResponseDto(question);
  }

  public async update(
    _id: string,
    dto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    await this.findQuestionByID(_id);

    await this.questionModel.updateOne({ _id }, dto);

    return this.findOne(_id);
  }
}
