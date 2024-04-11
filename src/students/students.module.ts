import { Global, Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { Student, StudentSchema } from './schemas/student.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsRegisterService } from './services/students-register.service';
import { StudentsRegisterController } from './controllers/students-register.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [StudentsController, StudentsRegisterController],
  providers: [StudentsService, StudentsRegisterService],
  exports: [StudentsService, StudentsRegisterService],
})
export class StudentsModule {}
