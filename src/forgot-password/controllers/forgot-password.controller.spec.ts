import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from '../services/forgot-password.service';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController],
      providers: [ForgotPasswordService],
    }).compile();

    controller = module.get<ForgotPasswordController>(ForgotPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
