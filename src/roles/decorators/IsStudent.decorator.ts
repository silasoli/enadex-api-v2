import { SetMetadata } from '@nestjs/common';

export const IS_STUDENT_KEY = 'isStudent';
export const IsStudent = () => SetMetadata(IS_STUDENT_KEY, true);
