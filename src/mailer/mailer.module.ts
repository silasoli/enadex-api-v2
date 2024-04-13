import { Global, Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';

@Global()
@Module({
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
