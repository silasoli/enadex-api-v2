import { Injectable } from '@nestjs/common';
import { CreateForgotPasswordDto } from '../dto/create-forgot-password.dto';
import { Manager } from '../../managers/schemas/manager.entity';
import { Student } from '../../students/schemas/student.entity';
import { ManagersService } from '../../managers/services/managers.service';
import { StudentsService } from '../../students/services/students.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from '../schema/forgot-password.entity';
import { Model } from 'mongoose';
import { ValidateForgotPasswordDto } from '../dto/validate-forgot-password.dto';
import * as moment from 'moment';
import { MailerService } from '../../mailer/services/mailer.service';
import { FORGOT_PASSWORD_ERRORS } from '../constants/forgot-password-errors';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(ForgotPassword.name)
    private forgotPasswordModel: Model<ForgotPasswordDocument>,
    private managersService: ManagersService,
    private studentsService: StudentsService,
    private mailerService: MailerService,
  ) { }

  private async findUserByEmail(
    email: string,
  ): Promise<Manager | Student | null> {
    let user: Manager | Student = null;

    user = await this.studentsService.findByEmail(email, true, true);
    if (user?.email) return user;

    user = await this.managersService.findByEmail(email, true);
    if (user?.email) return user;

    return null;
  }

  private async generateCustomerCode() {
    let isCodeUnique = false;
    let code: string;

    while (!isCodeUnique) {
      code = `${Math.random()}`.slice(-6);
      const existingCustomer = await this.forgotPasswordModel.findOne({ code });

      if (!existingCustomer) isCodeUnique = true;
    }

    return code;
  }

  private async invalidRequests(forgots: ForgotPassword[]): Promise<void> {
    forgots.forEach(async (forgot: ForgotPassword) => {
      await this.forgotPasswordModel.updateOne(
        { _id: forgot._id },
        { invalid: true },
      );
    });
  }

  public async create(dto: CreateForgotPasswordDto): Promise<void> {
    const user = await this.findUserByEmail(dto.email);
    if (!user) return null;

    const otgCode = await this.generateCustomerCode();

    const oldForgots = await this.findActiveRequestByEmail(dto.email);

    if (oldForgots) await this.invalidRequests(oldForgots);

    await this.forgotPasswordModel.create({
      ...dto,
      otgCode,
    });

    await this.mailerService.sendEmailWithTemplate(
      {
        emailAddress: user.email,
        title: 'Código de recuperação de senha',
      },
      { email: user.email, name: user.name, otgCode },
      'recover-password',
    );
  }

  public async findActiveRequestByEmail(
    email: string,
  ): Promise<ForgotPassword[]> {
    const forgots = await this.forgotPasswordModel.find({
      email: email.toLowerCase(),
      invalid: false,
      usedAt: { $exists: false },
    });

    return forgots.length === 0 ? null : forgots;
  }

  private async invalidRequest(forgotPassword: ForgotPassword): Promise<void> {
    await this.forgotPasswordModel.updateOne(
      { _id: forgotPassword._id },
      { invalid: true },
    );
  }

  private async completeRequest(forgotPassword: ForgotPassword): Promise<void> {
    await this.forgotPasswordModel.updateOne(
      { _id: forgotPassword._id },
      { usedAt: new Date(), invalid: true },
    );
  }

  private async findByOtgCode(
    otgCode: string,
    email: string,
  ): Promise<ForgotPassword> {
    return this.forgotPasswordModel.findOne({
      otgCode,
      email: email.toLocaleLowerCase(),
      invalid: false,
      usedAt: { $exists: false },
    });
  }

  private async updatePassword(
    user: Student | Manager,
    password: string,
  ): Promise<void> {
    if ((user as Manager)?.role) {
      await this.managersService.updatePassword(String(user._id), password);
    } else {
      await this.studentsService.updatePassword(String(user._id), password);
    }
  }

  public async validate(dto: ValidateForgotPasswordDto): Promise<any> {
    try {
      const forgotPassword = await this.findByOtgCode(dto.otgCode, dto.email);
      if (!forgotPassword) throw FORGOT_PASSWORD_ERRORS.INVALID_CODE;

      const secondsDiff = moment().diff(forgotPassword.createdAt, 'seconds');

      if (secondsDiff > 120) {
        await this.invalidRequest(forgotPassword);
        throw FORGOT_PASSWORD_ERRORS.INVALID_CODE_TIME;
      }

      const user = await this.findUserByEmail(forgotPassword.email);
      if (!user) throw FORGOT_PASSWORD_ERRORS.INVALID_CODE;

      await this.updatePassword(user, dto.password);

      await this.completeRequest(forgotPassword);

      await this.mailerService.sendEmailWithTemplate(
        {
          emailAddress: user.email,
          title: 'Senha alterada com sucesso',
        },
        {
          email: user.email,
          name: user.name,
          date: new Date().toLocaleDateString('pt-BR'),
        },
        'changed-password',
      );
    } catch (error) {
      console.log(error)
      return error;
    }
  }
}