import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileStrategyImpl } from './strategies/profile-strategy-impl';
import { StudentStrategy } from './strategies/student-strategy';
import { ManagerStrategy } from './strategies/manager-strategy';
import { ProfileController } from './controllers/profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ProfileStrategyImpl,
    StudentStrategy, 
    ManagerStrategy,
  ],
  exports: [ProfileService], 
})
export class ProfileModule {}
