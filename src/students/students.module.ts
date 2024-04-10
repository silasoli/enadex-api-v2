import { Global, Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { Student, StudentSchema } from './schemas/student.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentRegisterService } from './services/student-register.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentRegisterService],
  exports: [StudentsService, StudentRegisterService],
})
export class StudentsModule {}
