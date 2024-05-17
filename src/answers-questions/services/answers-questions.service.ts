import { Injectable } from '@nestjs/common';
import { CreateAnswersQuestionsDto } from '../dto/create-answers-question.dto';
import { Model } from 'mongoose';
import {
  AnswerQuestions,
  AnswerQuestionsDocument,
} from '../schemas/answers-question.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ANSWERS_QUESTIONS_ERRORS } from '../constants/questions-errors';
import { QuestionService } from '../../question/services/question.service';
import { AnswersQuestionsResponseDto } from '../dto/answers-questions-response.dto';

@Injectable()
export class AnswersQuestionsService {
  constructor(
    @InjectModel(AnswerQuestions.name)
    private answerModel: Model<AnswerQuestionsDocument>,
    private questionService: QuestionService,
  ) {}

  private async validCreate(
    question_id: string,
    student_id: string,
  ): Promise<void> {
    const exist = await this.answerModel.findOne({ question_id, student_id });
    if (exist) throw ANSWERS_QUESTIONS_ERRORS.ANSWER_ALREADY_EXISTS;
  }

  private async checkIfAnswerIsCorrect(
    question_id: string,
    selected_option_id: string,
  ): Promise<boolean> {
    const question = await this.questionService.findQuestionByID(question_id);

    const selectedOption = question.options.find(
      (option) => option._id.toString() === selected_option_id,
    );

    return selectedOption.correctOption;
  }

  public async create(
    dto: CreateAnswersQuestionsDto,
    student_id: string,
  ): Promise<AnswersQuestionsResponseDto> {
    const { question_id, selected_option_id } = dto;

    await this.validCreate(question_id, student_id);

    const right_answer = await this.checkIfAnswerIsCorrect(
      question_id,
      selected_option_id,
    );

    const created = await this.answerModel.create({
      ...dto,
      right_answer,
    });

    return new AnswersQuestionsResponseDto(created);
  }

  public async findAll(
    student_id: string,
  ): Promise<AnswersQuestionsResponseDto[]> {
    const data = await this.answerModel.find({ student_id });

    return data.map((item) => new AnswersQuestionsResponseDto(item));
  }

  public async findById(_id: string, student_id: string): Promise<any> {
    const answer = await this.answerModel.findOne({ _id, student_id });

    if (!answer) ANSWERS_QUESTIONS_ERRORS.NOT_FOUND;

    return new AnswersQuestionsResponseDto(answer);
  }

  public async findByQuestion(
    question_id: string,
    student_id: string,
  ): Promise<any> {
    const answer = await this.answerModel.findOne({
      question_id,
      student_id,
    });

    if (!answer) throw ANSWERS_QUESTIONS_ERRORS.NOT_FOUND;

    return new AnswersQuestionsResponseDto(answer);
  }

  public async deleteByQuestion(question_id: string) {
    await this.answerModel.deleteMany({ question_id });
  }
}
