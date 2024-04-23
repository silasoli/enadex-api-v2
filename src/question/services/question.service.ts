import { Injectable } from '@nestjs/common';
import { CreateQuestionDto, OptionPartDto } from '../dto/create-question.dto';
import {
  UpdateOptionPartDto,
  UpdateQuestionDto,
} from '../dto/update-question.dto';
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

  private validateSketch(active: boolean, sketch: boolean): void {
    if (active && sketch) throw QUESTIONS_ERRORS.ACTIVE_SKETCH;
  }

  private checkIfHaveCorrectOption(
    options: OptionPartDto[] | UpdateOptionPartDto[],
  ): void {
    const trueCount = options.filter((option) => option.correctOption).length;

    if (trueCount < 1) throw QUESTIONS_ERRORS.HAVE_CORRECT_OPTION;

    if (trueCount > 1) throw QUESTIONS_ERRORS.MULTIPLE_CORRECT_OPTION;
  }

  public async create(dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    this.validateSketch(dto.active, dto.sketch);

    if (dto.sketch) this.checkIfHaveCorrectOption(dto.options);

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

  // private mergeUpdatedOptions(
  //   existingOptions: OptionPart[],
  //   updatedOptions: UpdateOptionPartDto[],
  // ): UpdateOptionPartDto[] {
  //   const mergedOptions: UpdateOptionPartDto[] = [];

  //   for (const options of updatedOptions) {
  //     const existOption = existingOptions.find(
  //       (opt) => String(opt._id) === String(options?._id),
  //     );

  //     if (existOption) {
  //       mergedOptions.push({
  //         _id: String(existOption._id),
  //         description: options.description ?? existOption.description,
  //         correctOption: options.correctOption ?? existOption.correctOption,
  //       });
  //     } else {
  //       mergedOptions.push(options);
  //     }
  //   }

  //   return mergedOptions;
  // }

  // private addRemainingOptions(
  //   existingOptions: OptionPart[],
  //   mergedOptions: UpdateOptionPartDto[],
  // ): UpdateOptionPartDto[] {
  //   for (const option of existingOptions) {
  //     if (
  //       !mergedOptions.some((opt) => String(opt._id) === String(option._id))
  //     ) {
  //       mergedOptions.push({
  //         _id: String(option._id),
  //         description: option.description,
  //         correctOption: option.correctOption,
  //       });
  //     }
  //   }

  //   return mergedOptions;
  // }

  // private validateOptionsUpdate(
  //   existingOptions: OptionPart[],
  //   updatedOptions: UpdateOptionPartDto[],
  // ): UpdateOptionPartDto[] {
  //   const mergedOptions = this.mergeUpdatedOptions(
  //     existingOptions,
  //     updatedOptions,
  //   );
  //   const finalOptions = this.addRemainingOptions(
  //     existingOptions,
  //     mergedOptions,
  //   );

  //   return finalOptions;
  // }

  public async update(
    _id: string,
    dto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    const entity = await this.findQuestionByID(_id);

    if (dto?.active || dto?.sketch)
      this.validateSketch(
        dto.active ?? entity.active,
        dto.sketch ?? entity.sketch,
      );

    if (dto?.options) {
      // dto.options = this.validateOptionsUpdate(entity.options, dto.options);
      this.checkIfHaveCorrectOption(dto.options);
    }

    await this.questionModel.updateOne({ _id }, dto);

    return this.findOne(_id);
  }
}
