import { Injectable } from '@nestjs/common';
import { ProfileStrategy } from '../strategies/profile-strategy.interface';
import { StudentStrategy } from '../strategies/student-strategy';
import { ManagerStrategy } from '../strategies/manager-strategy';
import { ProfileTypeEnum } from '../constants/profile-type';
import { STUDENTS_ERRORS } from '../../students/constants/students-errors';
import { MANAGERS_ERRORS } from '../../managers/constants/managers-errors';
import { StudentResponseDto } from '../../students/dto/student-response.dto';
import { ManagerResponseDto } from '../../managers/dto/manager-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileStrategyImpl implements ProfileStrategy {
  constructor(
    private readonly studentStrategy: StudentStrategy,
    private readonly managerStrategy: ManagerStrategy,
  ) {}

  private async findUserType(_id: string): Promise<ProfileTypeEnum> {
    try {
      await this.managerStrategy.findOneProfile(_id);
      await this.studentStrategy.findOneProfile(_id);
    } catch (error) {
      if (error?.response === STUDENTS_ERRORS.NOT_FOUND.getResponse()) {
        return ProfileTypeEnum.MANAGERS;
      }

      if (error?.response === MANAGERS_ERRORS.NOT_FOUND.getResponse()) {
        return ProfileTypeEnum.STUDENTS;
      }
    }
  }

  public async findOneProfile(
    _id: string,
  ): Promise<ManagerResponseDto | StudentResponseDto> {
    const userType = await this.findUserType(_id);

    switch (userType) {
      case ProfileTypeEnum.MANAGERS: {
        return this.managerStrategy.findOneProfile(_id);
      }

      case ProfileTypeEnum.STUDENTS: {
        return this.studentStrategy.findOneProfile(_id);
      }
    }
  }

  public async updateOneProfile(
    _id: string,
    dto: UpdateProfileDto,
  ): Promise<ManagerResponseDto | StudentResponseDto> {
    const userType = await this.findUserType(_id);

    switch (userType) {
      case ProfileTypeEnum.MANAGERS: {
        return this.managerStrategy.updateOneProfile(_id, {
          email: dto.email,
          name: dto.name,
        });
      }

      case ProfileTypeEnum.STUDENTS: {
        return this.studentStrategy.updateOneProfile(_id, dto);
      }
    }
  }

  public async disableOneProfile(_id: string): Promise<void> {
    const userType = await this.findUserType(_id);

    switch (userType) {
      case ProfileTypeEnum.MANAGERS: {
        return this.managerStrategy.disableOneProfile(_id);
      }

      case ProfileTypeEnum.STUDENTS: {
        return this.studentStrategy.disableOneProfile(_id);
      }
    }
  }
}
