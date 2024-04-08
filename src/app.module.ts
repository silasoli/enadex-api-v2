import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ManagersModule } from './managers/managers.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ManagersModule,
    StudentsModule,
    AuthModule,
    RolesModule,
    ProfileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
