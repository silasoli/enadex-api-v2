import { Global, Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';

@Global()
@Module({
  providers: [MailerService],
})
export class MailerModule {}
