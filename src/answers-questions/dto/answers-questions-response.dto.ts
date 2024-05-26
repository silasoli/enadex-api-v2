import { ApiProperty } from '@nestjs/swagger';
import { AnswerQuestions } from '../schemas/answers-question.entity';
import { QuestionResponseDto } from '../../question/dto/question-response.dto';

export class AnswersQuestionsResponseDto {
  constructor(answer: AnswerQuestions) {
    const { _id, question_id, selected_option_id, student_id } = answer;

    return {
      _id: String(_id),
      question: question_id,
      selected_option_id,
      student_id,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true, type: QuestionResponseDto })
  question: QuestionResponseDto;

  @ApiProperty({ required: true })
  selected_option_id: string;

  @ApiProperty({ required: true })
  student_id: string;
}
