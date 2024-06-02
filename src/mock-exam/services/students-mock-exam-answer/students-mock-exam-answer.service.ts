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

    //verificar se opção selecionada existe pra questão
    //validar se usuario ta tentando alterar no exam.finishi

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
  ): Promise<StudentMockExamAnswer> {
    const exam = await this.examService.findById(exam_id, student_id);
    const mock_exam_id = String(exam.mock_exam_id);

    await this.validAnswer(mock_exam_id, exam);

    const answer = await this.findByDTO(dto, mock_exam_id, exam_id, student_id);

    if (answer) return this.update(String(answer._id), dto.selected_option_id);

    if (!answer) return this.create(dto, mock_exam_id, exam_id, student_id);
  }

  public async create(
    dto: CreateStudentMockExamAnswerDto,
    mock_exam_id: string,
    exam_id: string,
    student_id: string,
  ): Promise<StudentMockExamAnswer> {
    const created = await this.model.create({
      ...dto,
      mock_exam_id,
      exam_id,
      student_id,
    });

    return created;
  }

  public async update(_id: string, selected_option_id: string): Promise<any> {
    await this.model.updateOne({ _id }, { selected_option_id });
  }

  // public async findById(_id: string,  student_id: string): Promise<any> {
  //   //filtrar por exam/mockexam
  //   const answer = await this.model
  //     .findOne({ _id, student_id, exam_id  })
  //     .populate({ path: 'question_id' });

  //   if (!answer) STUDENTS_MOCK_EXAM_ANSWER_ERRORS.NOT_FOUND;

  //   return answer;
  //   // return new AnswersQuestionsResponseDto(answer);
  // }

  public async findAll(exam_id: string, student_id: string): Promise<any[]> {
    const exam = await this.examService.findById(exam_id, student_id);

    const mock_exam_id = String(exam.mock_exam_id);

    const data = await this.model
      .find({ student_id, exam_id, mock_exam_id })
      .populate({ path: 'question_id' });

    return data;
    // return data.map((item) => new AnswersQuestionsResponseDto(item));
  }
}
