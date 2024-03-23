import { Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
