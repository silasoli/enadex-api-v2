import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ForgotPasswordController } from './controllers/forgot-password.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from './schema/forgot-password.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ForgotPassword.name, schema: ForgotPasswordSchema },
    ]),
  ],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
