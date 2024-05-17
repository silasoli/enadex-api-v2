import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ManagersModule } from './managers/managers.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { MailerModule } from './mailer/mailer.module';
import { ProfileModule } from './profile/profile.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { QuestionModule } from './question/question.module';
import { CoursesModule } from './courses/courses.module';
import { AnswersQuestionsModule } from './answers-questions/answers-questions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ManagersModule,
    StudentsModule,
    AuthModule,
    RolesModule,
    MailerModule,
    ProfileModule,
    ForgotPasswordModule,
    HealthCheckModule,
    QuestionModule,
    CoursesModule,
    AnswersQuestionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
