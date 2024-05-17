import { ApiProperty } from '@nestjs/swagger';
import { AnswerQuestions } from '../schemas/answers-question.entity';

export class AnswersQuestionsResponseDto {
  constructor(answer: AnswerQuestions) {
    const { _id, question_id, right_answer, selected_option_id, student_id } =
      answer;

    return {
      _id: String(_id),
      question_id: String(question_id),
      right_answer,
      selected_option_id,
      student_id,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  question_id: string;

  @ApiProperty({ required: true })
  right_answer: boolean;

  @ApiProperty({ required: true })
  selected_option_id: string;

  @ApiProperty({ required: true })
  student_id: string;
}
