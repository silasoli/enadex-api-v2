import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  StudentMockExamAnswer,
  StudentMockExamAnswerDocument,
} from '../../schemas/students-mock-exam-answer.entity';
import { CreateStudentMockExamAnswerDto } from '../../dto/students-mock-exam-answer/create-student-mock-exam-answer.dto';
import { StudentsMockExamService } from '../students-mock-exam/students-mock-exam.service';
import { MockExamQuestionsService } from '../mock-exam-questions/mock-exam-questions.service';
import { MockExamService } from '../mock-exam/mock-exam.service';
import { MockExam } from '../../schemas/mock-exam.entity';
import { StudentMockExamResponseDto } from '../../dto/students-mock-exam/mock-exam-response.dto';
import { StudentMockExamAnswerResponseDto } from '../../dto/students-mock-exam-answer/students-mock-exam-answer-response.dto';
import { STUDENTS_MOCK_EXAM_ANSWER_ERRORS } from '../../constants/students-exam-answer-errors';
import { MockExamQuestionResponseDto } from '../../dto/mock-exam-questions/mock-exam-question-response.dto';

@Injectable()
export class StudentsMockExamAnswerService {
  constructor(
    @InjectModel(StudentMockExamAnswer.name)
    private model: Model<StudentMockExamAnswerDocument>,
    private readonly examService: StudentsMockExamService,
    private readonly mockExamService: MockExamService,
    private readonly mockExamQuestionsService: MockExamQuestionsService,
  ) {}

  private validDuration(duration: number, start: Date): boolean {
    const now = new Date();

    const elapsedTime = (now.getTime() - new Date(start).getTime()) / 1000;

    return elapsedTime >= duration;
  }

  private validIfMockExamFinished(mockExam: MockExam): boolean {
    return mockExam.finished || mockExam.finishedAt !== null;
  }

  private async validAnswer(
    mock_exam_id: string,
    exam: StudentMockExamResponseDto,
  ) {
    const mockExam = await this.mockExamService.findMockExamByID(mock_exam_id);

    const expiredDuration = this.validDuration(
      mockExam.duration,
      exam.createdAt,
    );

    const mockExamFinished = this.validIfMockExamFinished(mockExam);

    if ([expiredDuration, mockExamFinished].includes(true))
      throw new UnprocessableEntityException('finalizar simulado');
  }

  public async checkOptionBelongsQuestion(
    question_id: string,
    selected_option_id: string,
  ): Promise<void> {
    const belongsQuestion =
      await this.mockExamQuestionsService.checkOptionBelongsQuestion(
        question_id,
        selected_option_id,
      );

    if (!belongsQuestion)
      throw STUDENTS_MOCK_EXAM_ANSWER_ERRORS.OPTION_NOT_FOUND;
  }

  private async findByDTO(
    dto: CreateStudentMockExamAnswerDto,
    mock_exam_id: string,
    exam_id: string,
    student_id: string,
  ): Promise<StudentMockExamAnswer> {
    const { question_id, selected_option_id } = dto;

    await this.mockExamQuestionsService.findQuestionByID(
      dto.question_id,
      mock_exam_id,
    );

    if (selected_option_id !== null)
      await this.checkOptionBelongsQuestion(question_id, selected_option_id);

    return this.model.findOne({
      student_id,
      question_id,
      exam_id,
      mock_exam_id,
    });
  }

  public async createOrUpdate(
    dto: CreateStudentMockExamAnswerDto,
    exam_id: string,
    student_id: string,
  ): Promise<StudentMockExamAnswerResponseDto> {
    const exam = await this.examService.findById(exam_id, student_id);
    if (exam.finished) throw STUDENTS_MOCK_EXAM_ANSWER_ERRORS.FINISHED_EXAM;

    const mock_exam_id = String(exam.mock_exam_id);

    await this.validAnswer(mock_exam_id, exam);

    const answer = await this.findByDTO(dto, mock_exam_id, exam_id, student_id);

    if (answer)
      return this.update(String(answer._id), dto.selected_option_id || null);

    if (!answer) return this.create(dto, mock_exam_id, exam_id, student_id);
  }

  public async create(
    dto: CreateStudentMockExamAnswerDto,
    mock_exam_id: string,
    exam_id: string,
    student_id: string,
  ): Promise<StudentMockExamAnswerResponseDto> {
    const created = await this.model.create({
      ...dto,
      mock_exam_id,
      exam_id,
      student_id,
    });

    return this.findOne(String(created._id));
  }

  public async update(
    _id: string,
    selected_option_id: string,
  ): Promise<StudentMockExamAnswerResponseDto> {
    await this.model.updateOne({ _id }, { selected_option_id });

    return this.findOne(_id);
  }

  public async findOne(_id: string): Promise<StudentMockExamAnswerResponseDto> {
    const answer = await this.model.findById(_id);

    return new StudentMockExamAnswerResponseDto(answer);
  }

  public async findAll(
    exam_id: string,
    student_id: string,
  ): Promise<StudentMockExamAnswerResponseDto[]> {
    const exam = await this.examService.findById(exam_id, student_id);

    const mock_exam_id = String(exam.mock_exam_id);

    const data = await this.model.find({ student_id, exam_id, mock_exam_id });
    // .populate({ path: 'question_id' });

    return data.map((item) => new StudentMockExamAnswerResponseDto(item));
  }

  private countExamPerformance(
    questions: MockExamQuestionResponseDto[],
    studentAnswers: StudentMockExamAnswer[],
  ) {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    for (const question of questions) {
      const answer = studentAnswers.find(
        (ans) => ans.question_id.toString() === question._id.toString(),
      );

      if (!answer || answer.selected_option_id === null) {
        unanswered++;
      } else {
        const selectedOption = question.options.find(
          (option) =>
            option._id.toString() === answer.selected_option_id.toString(),
        );

        if (selectedOption && selectedOption.correctOption) {
          correct++;
        } else {
          incorrect++;
        }
      }
    }

    return { correct, incorrect, unanswered };
  }

  public async examAnswersResume(exam_id: string, student_id: string) {
    const exam = await this.examService.findById(exam_id, student_id);

    const mock_exam_id = String(exam.mock_exam_id);

    const mockExam = await this.mockExamService.findMockExamByID(mock_exam_id);

    if (!exam.finished && !mockExam.finished)
      throw STUDENTS_MOCK_EXAM_ANSWER_ERRORS.RESUME_NOT_AVAILABLE;

    const questions = await this.mockExamQuestionsService.findAll(
      mock_exam_id,
      {},
    );

    const data = await this.model.find({ student_id, exam_id, mock_exam_id });

    return this.countExamPerformance(questions, data);
  }
}
