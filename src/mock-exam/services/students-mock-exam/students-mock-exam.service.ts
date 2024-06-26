import { Injectable } from '@nestjs/common';
import {
  StudentsMockExam,
  StudentsMockExamDocument,
} from '../../schemas/students-mock-exam.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentMockExamDto } from '../../dto/students-mock-exam/create-student-mock-exam.dto';
import { MockExamService } from '../mock-exam/mock-exam.service';
import { StudentMockExamResponseDto } from '../../dto/students-mock-exam/mock-exam-response.dto';
import { STUDENTS_MOCK_EXAM_ERRORS } from '../../constants/students-exam-errors';
import { MockExamQuestionsService } from '../mock-exam-questions/mock-exam-questions.service';
import { MockExamQuestionResponseDto } from '../../dto/mock-exam-questions/mock-exam-question-response.dto';
import { MockExamResponseDto } from '../../dto/mock-exam/mock-exam-response.dto';

@Injectable()
export class StudentsMockExamService {
  constructor(
    @InjectModel(StudentsMockExam.name)
    private model: Model<StudentsMockExamDocument>,
    private readonly mockExamService: MockExamService,
    private readonly mockExamQuestionsService: MockExamQuestionsService,
  ) {}

  private async validOpenMockExam(student_id: string): Promise<void> {
    const mockExam = await this.model.findOne({
      student_id,
      finished: false,
      finishedAt: null,
    });

    if (mockExam) throw STUDENTS_MOCK_EXAM_ERRORS.OPENED_EXAM;
  }

  public async findAllOpened(
    student_id: string,
  ): Promise<StudentMockExamResponseDto[]> {
    const studentMockExams = await this.model
      .find({
        student_id,
        finished: false,
        finishedAt: null,
      })
      .populate({ path: 'mock_exam_id' });

    return studentMockExams.map((item) => new StudentMockExamResponseDto(item));
  }

  public async findAllFinished(
    student_id: string,
  ): Promise<StudentMockExamResponseDto[]> {
    const studentMockExams = await this.model
      .find({
        student_id,
        finished: true,
        finishedAt: { $ne: null },
      })
      .populate({ path: 'mock_exam_id' });

    return studentMockExams.map((item) => new StudentMockExamResponseDto(item));
  }

  private async findByMockExam(
    student_id: string,
    mock_exam_id: string,
  ): Promise<StudentsMockExam | null> {
    return this.model.findOne({ student_id, mock_exam_id });
  }

  private async validClosedMockExam(mock_exam_id: string): Promise<void> {
    const mockExam = await this.mockExamService.findMockExamByID(mock_exam_id);
    if (mockExam.finished) throw STUDENTS_MOCK_EXAM_ERRORS.CLOSED_MOCK_EXAM;
  }

  private async validExistMockExam(
    student_id: string,
    mock_exam_id: string,
  ): Promise<void> {
    const studentMockExam = await this.findByMockExam(student_id, mock_exam_id);
    if (studentMockExam) throw STUDENTS_MOCK_EXAM_ERRORS.EXIST_MOCK_EXAM;
  }

  private async validExistMockExamInYear(
    student_id: string,
    mock_exam_id: string,
  ): Promise<void> {
    const year = new Date().getFullYear();

    const studentMockExam = await this.model.findOne({
      student_id,
      mock_exam_id,
      createdAt: {
        $gte: `${year}-01-01T00:00:00.000Z`,
        $lte: `${year}-12-31T23:59:59.999Z`,
      },
    });

    if (studentMockExam) throw STUDENTS_MOCK_EXAM_ERRORS.YEAR_MOCK_EXAM;
  }

  public async create(
    student_id: string,
    dto: CreateStudentMockExamDto,
  ): Promise<StudentMockExamResponseDto> {
    await this.validClosedMockExam(dto.mock_exam_id);
    await this.validExistMockExam(student_id, dto.mock_exam_id);
    await this.validOpenMockExam(student_id);
    await this.validExistMockExamInYear(student_id, dto.mock_exam_id);

    const created = await this.model.create({ ...dto, student_id });

    return new StudentMockExamResponseDto(created);
  }

  public async findAll(
    student_id: string,
  ): Promise<StudentMockExamResponseDto[]> {
    const studentMockExams = await this.model.find({ student_id });

    return studentMockExams.map((item) => new StudentMockExamResponseDto(item));
  }

  public async findQuestions(
    _id: string,
    student_id: string,
  ): Promise<MockExamQuestionResponseDto[]> {
    const studentMockExam = await this.findById(_id, student_id);

    return this.mockExamQuestionsService.findAll(
      studentMockExam.mock_exam_id,
      {},
    );
    //fazer tratamento para retornar correctioOption null se não tiver exam finalizado e mockexam finalizado
  }

  public async findAllMockExamAvailable(
    student_id: string,
  ): Promise<MockExamResponseDto[]> {
    const mockExams = await this.mockExamService.findAllAvailable();
    const exams = await this.findAll(student_id);

    const availableMockExams: MockExamResponseDto[] = [];

    for (const mockExam of mockExams) {
      const studentExam = exams.find(
        (exam) => exam.mock_exam_id.toString() === mockExam._id.toString(),
      );

      if (!studentExam) availableMockExams.push(mockExam);
    }

    return availableMockExams;
  }
  public async findById(
    _id: string,
    student_id: string,
  ): Promise<StudentMockExamResponseDto> {
    const studentMockExam = await this.model.findOne({
      _id,
      student_id,
    });

    if (!studentMockExam) throw STUDENTS_MOCK_EXAM_ERRORS.NOT_FOUND;

    return new StudentMockExamResponseDto(studentMockExam);
  }

  private async validDuration(mock_exam_id: string, start: Date) {
    const mockExam = await this.mockExamService.findMockExamByID(mock_exam_id);
    const now = new Date();

    const elapsedTime = (now.getTime() - new Date(start).getTime()) / 1000;

    return elapsedTime >= mockExam.duration;
  }

  public async finishStudentMockExam(
    _id: string,
    student_id: string,
  ): Promise<StudentMockExamResponseDto> {
    await this.model.updateOne(
      { _id, student_id },
      { finished: true, finishedAt: new Date() },
    );

    return this.findById(_id, student_id);
  }
}
