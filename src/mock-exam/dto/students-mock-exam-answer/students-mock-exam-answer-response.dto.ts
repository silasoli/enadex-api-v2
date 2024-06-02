import { ApiProperty } from '@nestjs/swagger';
import { StudentMockExamAnswer } from '../../schemas/students-mock-exam-answer.entity';

export class StudentMockExamAnswerResponseDto {
  constructor(studentMockExamAnswer: StudentMockExamAnswer) {
    const {
      _id,
      question_id,
      mock_exam_id,
      exam_id,
      student_id,
      selected_option_id,
    } = studentMockExamAnswer;

    return {
      _id: String(_id),
      mock_exam_id: String(mock_exam_id),
      student_id: String(student_id),
      question_id: String(question_id),
      exam_id: String(exam_id),
      selected_option_id: String(selected_option_id),
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  mock_exam_id: string;
 
  @ApiProperty({ required: true })
  student_id: string;

  @ApiProperty({ required: true })
  question_id: string;

  @ApiProperty({ required: true })
  exam_id: string;

  @ApiProperty({ required: true })
  selected_option_id: string;
}
